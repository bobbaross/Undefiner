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
        utils = new Utils(client);
        utils.getDB(message.guild.id).then(async res => {
            if (!res) res = await utils.createDB(message.guild.id);
            let bypassRoles = [];
            for (let role of res.modRoles) {
                bypassRoles.push(role);
            }
            for (let role of res.adminRoles) {
                bypassRoles.push(role);
            }
            if (!message.member.hasPermission("MANAGE_MESSAGES") && !message.member.roles.cache.some(r => bypassRoles.includes(r.id))) {
                let embed = new MessageEmbed()
                .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("MANAGE_MESSAGES") ? "Whoops" : "Manage Messages"} amongst your permissions.`);
                return message.channel.send(embed).catch(err => err);
            }
            if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
                let embed = new MessageEmbed()
                .setDescription(`Ehem... Maybe sort my permissions first? I need the Manage Roles permissions.`)
                return message.channel.send(embed).catch(err => err);
            }
            let mutedRole = await utils.getRole(res.settings.mutedRole, message.guild.roles);
            if (!mutedRole) {
                mutedRole = await utils.getRole("muted", message.guild.roles);
            }
            if (mutedRole) {
                res.settings.mutedRole = mutedRole.id;
                await utils.saveDB(res);
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
                await utils.saveDB(res);
            }
            if (!args[0]) {
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me who to mute.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            var user = await utils.getUser(args[0]);
            if (!user) {
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me a real member.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            var member = message.guild.member(user);
            await member;
            if (!member) {
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me a member from this server.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            if (member.user.id === message.author.id) {
                let embed = new MessageEmbed()
                .setDescription(`This isn't a good idea...\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            if (member.roles.highest.position >= message.member.roles.highest.position) {
                let embed = new MessageEmbed()
                .setDescription(`Hey, I don't think you should mute them.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            if (member.roles.cache.some(r => bypassRoles.includes(r.id))) {
                let embed = new MessageEmbed()
                .setDescription(`I wouldn't mute that person if I was you.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            if (member.roles.cache.has(mutedRole.id)) {
                let embed = new MessageEmbed()
                .setDescription(`Uhm... I am pretty sure they're already muted, to be honest.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            await args.shift();
            var time = await utils.setTime(args[0]);
            if (time !== null) await args.shift();
            var reason = args.slice(0).join(' ');
            if (!reason) {
                let embed = new MessageEmbed()
                .setDescription(`Wait I don't wanna do this without a reason.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            res.cases++;
            var duration = await utils.getTime(time-Date.now());
            if (time-Date.now() < 0) duration = null;
            if (res.settings.dmOnPunished === true) {
                let dmEmbed = new MessageEmbed()
                .setColor(bad)
                .setTitle(`You've been muted in ${message.guild.name}, here is a copy of the log!\nMember Muted | Case #${res.cases}`)
                .addField(`Member`, member.user.tag, true)
                .addField(`Moderator`, message.author.tag, true)
                .addField(`Reason`, reason, true)
                .setFooter(`${duration !== null ? `This mute will last ${duration} | ` : ""}${user.id}`)
                .setTimestamp()
                user.send(dmEmbed).catch(err => err);
            }
            member.roles.add(mutedRole.id, `Muted by ${message.author.tag} with reason: ${reason}`).then(async () => {
                utils.getEntries("mute").then(async activeMutes => {
                    if (!time) return;
                    activeMutes.entries.push({
                        guildId: message.guild.id,
                        userId: user.id,
                        time: time,
                        reason: reason,
                        happenedAt: Date.now()
                    });
                    await utils.saveDB(activeMutes).catch(err => console.error(err));
                });
                let embed = new MessageEmbed()
                .setDescription(`${user.tag} has been muted. ${res.settings.withReason === true ? reason : ""}`);
                message.channel.send(embed).catch(err => err);
                var embedId;
                var modLogsChan = await utils.getChannel(res.settings.modLogs, message.guild.channels);
                if (modLogsChan || res.settings.modLogs === "there") {
                    if (res.settings.modLogs === "there") modLogsChan = message.channel;
                    embedId = new Promise(resolve => {
                        let modLogEmbed = new MessageEmbed()
                        .setColor(bad)
                        .setTitle(`Member Muted | Case #${res.cases}`)
                        .addField(`Member`, member.user.tag, true)
                        .addField(`Moderator`, message.author.tag, true)
                        .addField(`Reason`, reason, true)
                        .setFooter(`${duration !== null ? `This mute will last ${duration} | ` : ""}${user.id}`)
                        .setTimestamp()
                        modLogsChan.send(modLogEmbed).then(msg => {
                            resolve(msg.id);
                        }).catch(err => err);
                    });
                }
                res.modCases.push({
                    type: "mute",
                    case: res.cases,
                    userId: user.id,
                    userTag: user.tag,
                    modId: message.author.id,
                    modTag: message.author.tag,
                    duration: duration ? duration : "Nope",
                    reason: reason,
                    embedId: embedId ? embedId : null,
                    happenedAt: Date.now()
                });
                await utils.saveDB(res).catch(err => console.error(err));
                if (res.settings.deleteModCommands === true) message.delete();
            });
        });
    }
}