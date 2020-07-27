const {MessageEmbed} = require('discord.js');
const { Utils } = require('../functions/functions.js');
const { response } = require('express');
const {bad} = require('../config.json').colors;

module.exports = {
    name: "mute",
    description: "Mute a member.",
    aliases: ['silence'],
    category: "moderation",
    usage: "<member> [time] <reason>",
    guildOnly: true,

    async undefine(client, message, args) {
        var {getUser,getRole,getChannel,getTime,setTime,createDB,getDB,getEntries,saveDB} = new Utils(client);
        getDB(message.guild.id).then(async res => {
            let bypassRoles = [];
            for (let role of res.modRoles) {
                bypassRoles.push(role);
            }
            for (let role of res.adminRoles) {
                bypassRoles.push(role);
            }
            if (!message.member.hasPermission("MANAGE_MESSAGES") && !bypassRoles.some(r => message.member.roles.has(r))) {
                let embed = new MessageEmbed()
                .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("MANAGE_MESSAGES") ? "Whoops" : "Manage Messages"} amongst your permissions.`);
                return message.channel.send(embed).catch(err => err);
            }
            if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
                let embed = new MessageEmbed()
                .setDescription(`Ehem... Maybe sort my permissions first? I need the Manage Roles permissions.`)
                return message.channel.send(embed).catch(err => err);
            }
            if (!res) res = await createDB(message.guild.id);
            var mutedRole = await getRole(res.settings.mutedRole, message.guild.roles);
            if (!mutedRole) mutedRole = await getRole("muted", message.guild.roles);
            if (mutedRole) {
                res.settings.mutedRole = mutedRole.id;
                saveDB(res);
            }
            if (!mutedRole) {
                mutedRole = new Promise((resolve) => {
                        message.guild.roles.create({
                            data: {
                                name: "Muted",
                                permissions: {
                                    SEND_MESSAGES: false
                                }
                            }
                    }).then(newRole => {
                        message.guild.channels.cache.each(channel => {
                            channel.createOverwrite(newRole, {
                                SEND_MESSAGES: false
                            });
                        });
                        return resolve(newRole)
                    });
                });
                await mutedRole;
                res.settings.mutedRole = mutedRole;
                saveDB(mutedRole);
            }
            if (!args[0]) {
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me who to mute.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            var user = await getUser(user);
            if (!user) {
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me a real member.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            var member = message.guild.member(user.id);
            if (!member) {
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me a member from this server.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            if (member.roles.has(mutedRole.id)) {
                let embed = new MessageEmbed()
                .setDescription(`Uhm... I am pretty sure they're already muted, to be honest.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            await args.shift();
            var time = await setTime(args[0]);
            if (time !== null) await args.shift();
            var reason = args.slice(0).join(' ');
            if (!reason) {
                let embed = new MessageEmbed()
                .setDescription(`Wait I don't wanna do this without a reason.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            member.roles.add(mutedRole.id, `Muted by ${message.author.tag} with reason: ${reason}`).then(() => {
                getEntries("mute").then(async activeMutes => {
                    activeMutes.push({
                        guildId: message.guild.id,
                        userId: user.id,
                        time: time,
                        reason: reason,
                        happenedAt: Date.now()
                    });
                    saveDB(activeMutes).catch(err => console.error(err));
                    res.cases++;
                    var duration = await getTime(time-Date.now());
                    let embed = new MessageEmbed()
                    .setDescription(`${user.tag} has been muted. ${res.settings.withReason === true ? reason : ""}`);
                    message.channel.send(embed).catch(err => err);
                    var embedId;
                    var modLogsChan = await getChannel(res.settings.modLogs);
                    if (modLogsChan) {
                        embedId = new Promise(resolve => {
                            let modLogEmbed = new MessageEmbed()
                            .setColor(good)
                            .setTitle(`Member Muted #${res.cases}`)
                            .addField(`Member`, member.user.tag, true)
                            .addField(`Moderator`, message.author.tag, true)
                            .addField(`Reason`, reason, true)
                            .setFooter(`This mute will last ${duration} | ${user.id}`)
                            .setTimestamp()
                            modLogsChan.send(modLogEmbed).then(msg => {
                                resolve(msg.id);
                            }).catch(err => err);
                        });
                    }
                    res.modCases.push({
                        case: res.cases,
                        userId: user.id,
                        userTag: user.tag,
                        modId: message.auhtor.id,
                        modTag: message.author.tag,
                        duration: duration,
                        reason: reason,
                        embedId: embedId ? embedId : null,
                        happenedAt: Date.now()
                    });
                    saveDB(res).catch(err => console.error(err));
                    if (res.settings.deleteModCommands === true) message.delete();
                });
            });
        });
    }
}