const {MessageEmbed} = require('discord.js');
const { Utils } = require('../functions/functions.js');
const {good} = require('../config.json').colors;

module.exports = {
    name: "unban",
    description: "Unban a member.",
    aliases: ['unbanish'],
    category: "moderation",
    usage: "<member> <reason>",
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
            if (!message.member.hasPermission("BAN_MEMBERS") && !message.member.roles.cache.some(r => bypassRoles.includes(r.id))) {
                let embed = new MessageEmbed()
                .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("BAN_MEMBERS") ? "Whoops" : "Ban Members"} amongst your permissions.`);
                return message.channel.send(embed).catch(err => err);
            }
            if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
                let embed = new MessageEmbed()
                .setDescription(`Ehem... Maybe sort my permissions first? I need the Ban Members permissions.`)
                return message.channel.send(embed).catch(err => err);
            }
            if (!args[0]) {
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me who to unban.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            var user = await utils.getUser(args[0]);
            var userId;
            if (!user) userId = args[0];
            else if (user) userId = user.id;
            message.guild.fetchBan(userId).then(async ban => {
                if (!ban) {
                    let embed = new MessageEmbed()
                    .setDescription(`Yeah no, I don't think they're banned.\n${this.name} ${this.usage}`);
                    return message.channel.send(embed).catch(err => err);
                }
                await args.shift();
                var reason = args.slice(0).join(' ');
                if (!reason) reason = "No reason specified.";
                res.cases++;
                message.guild.members.unban(userId).then(async () => {
                    let embed = new MessageEmbed()
                .setDescription(`${userId} has been unbanned. ${res.settings.withReason === true ? reason : ""}`);
                message.channel.send(embed).catch(err => err);
                var embedId;
                var modLogsChan = await utils.getChannel(res.settings.modLogs, message.guild.channels);
                if (modLogsChan || res.settings.modLogs === "there") {
                    if (res.settings.modLogs === "there") modLogsChan = message.channel;
                    embedId = new Promise(resolve => {
                        let modLogEmbed = new MessageEmbed()
                        .setColor(bad)
                        .setTitle(`Member Unbanned | Case #${res.cases}`)
                        .addField(`Member`, userId, true)
                        .addField(`Moderator`, message.author.tag, true)
                        .addField(`Reason`, reason, true)
                        .setFooter(`${userId}`)
                        .setTimestamp()
                        modLogsChan.send(modLogEmbed).then(msg => {
                            resolve(msg.id);
                        }).catch(err => err);
                    });
                }
                res.modCases.push({
                    type: "Unban",
                    case: res.cases,
                    userId: userId,
                    modId: message.author.id,
                    modTag: message.author.tag,
                    reason: reason,
                    embedId: embedId ? embedId : null,
                    happenedAt: Date.now()
                });
                await utils.saveDB(res).catch(err => console.error(err));
                utils.getEntries("ban").then(async activeBans => {
                    for (let entry of activeBans.entries) {
                        if (entry.guildId == message.guild.id && entry.userId == userId) {
                            let index = activeBans.entries.indexOf(entry);
                            activeBans.entries.splice(index, 1);
                            await activeBans;
                            await utils.saveDB(activeBans).catch(err => console.error(err));
                        }
                    }
                });
                if (res.settings.deleteModCommands === true) message.delete();
                });
            });
        });
    }
}