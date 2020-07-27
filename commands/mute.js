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
        console.log('a');
        utils = new Utils(client);
        utils.getDB(message.guild.id).then(async res => {
            if (!res) res = await utils.createDB(message.guild.id);
            let bypassRoles = [];
            console.log('b');
            for (let role of res.modRoles) {
                bypassRoles.push(role);
            }
            for (let role of res.adminRoles) {
                bypassRoles.push(role);
            }
            console.log('c');
            console.log(bypassRoles);
            if (!message.member.hasPermission("MANAGE_MESSAGES") && !bypassRoles.some(r => message.member.roles.has(r))) {
                console.log('d'+' MNGMSGS');
                let embed = new MessageEmbed()
                .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("MANAGE_MESSAGES") ? "Whoops" : "Manage Messages"} amongst your permissions.`);
                return message.channel.send(embed).catch(err => err);
            }
            if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
                console.log('e'+' MNGRLS');
                let embed = new MessageEmbed()
                .setDescription(`Ehem... Maybe sort my permissions first? I need the Manage Roles permissions.`)
                return message.channel.send(embed).catch(err => err);
            }
            console.log('h');
            let mutedRole = await utils.getRole(res.settings.mutedRole, message.guild.roles);
            console.log('g');
            if (!mutedRole) {
                mutedRole = await utils.getRole("muted", message.guild.roles);
            }
            console.log('i');
            if (mutedRole) {
                console.log('j'+' MTDRL');
                res.settings.mutedRole = mutedRole.id;
                await utils.saveDB(res);
            }
            console.log('q');
            if (!mutedRole) {
                console.log('w NMTDRL');
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
            console.log('r');
            if (!args[0]) {
                console.log('t NARGSZ');
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me who to mute.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            console.log('y');
            var user = await utils.getUser(args[0]);
            console.log('u');
            if (!user) {
                console.log('o NUSR');
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me a real member.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            console.log('p');
            var member = message.guild.member(user);
            await member;
            console.log('S');
            if (!member) {
                console.log('K MMBR');
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me a member from this server.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            console.log('L');
            if (member.roles.cache.has(mutedRole.id)) {
                console.log('Z MMBHRL');
                let embed = new MessageEmbed()
                .setDescription(`Uhm... I am pretty sure they're already muted, to be honest.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            console.log('X');
            await args.shift();
            console.log('V');
            var time = await utils.setTime(args[0]);
            console.log('N');
            if (time !== null) await args.shift();
            console.log('M');
            var reason = args.slice(0).join(' ');
            console.log('Q');
            if (!reason) {
                console.log('W RSN');
                let embed = new MessageEmbed()
                .setDescription(`Wait I don't wanna do this without a reason.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            console.log('E');
            member.roles.add(mutedRole.id, `Muted by ${message.author.tag} with reason: ${reason}`).then(() => {
                console.log('R');
                utils.getEntries("mute").then(async activeMutes => {
                    console.log('T');
                    activeMutes.entries.push({
                        guildId: message.guild.id,
                        userId: user.id,
                        time: time,
                        reason: reason,
                        happenedAt: Date.now()
                    });
                    console.log('Y');
                    await utils.saveDB(activeMutes).catch(err => console.error(err));
                    console.log('U');
                    res.cases++;
                    console.log('I');
                    var duration = await utils.getTime(time-Date.now());
                    console.log('O');
                    let embed = new MessageEmbed()
                    .setDescription(`${user.tag} has been muted. ${res.settings.withReason === true ? reason : ""}`);
                    message.channel.send(embed).catch(err => err);
                    console.log('P');
                    var embedId;
                    console.log('A');
                    var modLogsChan = await utils.getChannel(res.settings.modLogs, message.guild.channels);
                    console.log('S');
                    if (modLogsChan) {
                        console.log('D');
                        embedId = new Promise(resolve => {
                            console.log('F');
                            let modLogEmbed = new MessageEmbed()
                            .setColor(bad)
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
                    console.log('G');
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
                    console.log('H');
                    await utils.saveDB(res).catch(err => console.error(err));
                    console.log('J');
                    if (res.settings.deleteModCommands === true) message.delete();
                });
            });
        });
    }
}