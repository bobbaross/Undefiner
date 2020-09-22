const {MessageEmbed} = require('discord.js');
const {good,branding} = require('../config.json').colors;
const uniqid = require('uniqid');

module.exports = {
    name: "unban",
    description: "Unban a member.",
    aliases: ['unbanish'],
    category: "moderation",
    usage: "<member> <reason>",
    guildOnly: true,

    async undefine(client, message, args, hasEmbedPerms) {
        client.functions.getModDB(message.guild.id).then(async res => {
            if (!res) res = await client.functions.createModDB(message.guild.id);
            client.functions.getSettingsDB(message.guild.id).then(async setRes => {
                if (!setRes) setRes = await client.functions.createSettingsDB(message.guild.id);
                let bypassRoles = [];
                for (let role of setRes.modRoles) {
                    bypassRoles.push(role);
                }
                for (let role of setRes.adminRoles) {
                    bypassRoles.push(role);
                }
                if (!message.member.hasPermission("BAN_MEMBERS") && !message.member.roles.cache.some(r => bypassRoles.includes(r.id))) {
                    let embed = new MessageEmbed()
                    .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("BAN_MEMBERS") ? "Whoops" : "Ban Members"} amongst your permissions.`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
                    let embed = new MessageEmbed()
                    .setDescription(`Ehem... Maybe sort my permissions first? I need the Ban Members permissions.`)
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                if (!args[0]) {
                    let embed = new MessageEmbed()
                    .setDescription(`Now you see, there is something called telling me who to unban.\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                var user = await client.functions.getUser(args[0]);
                var userId;
                if (!user) userId = args[0];
                else if (user) userId = user.id;
                message.guild.fetchBan(userId).then(async ban => {
                    if (!ban) {
                        let embed = new MessageEmbed()
                        .setDescription(`Yeah no, I don't think they're banned.\n${this.name} ${this.usage}`);
                        if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                    }
                    await args.shift();
                    var reason = args.slice(0).join(' ');
                    if (!reason) reason = "No reason specified.";
                    res.cases++;
                    message.guild.members.unban(userId).then(async () => {
                        let embed = new MessageEmbed()
                        .setColor(branding)
                        .setDescription(`${userId} has been unbanned. ${setRes.settings.withReason === true ? reason : ""}`);
                        if (hasEmbedPerms === true) {
                            message.channel.send(embed).catch(err => err);
                        } else {
                            message.channel.send(embed.description).catch(err => err)
                        }
                    var embedId;
                    var modLogsChan = await client.functions.getChannel(setRes.settings.modLogs, message.guild.channels.cache);
                    if (modLogsChan || setRes.settings.modLogs === "there") {
                        if (setRes.settings.modLogs === "there") modLogsChan = message.channel;
                        embedId = await new Promise(resolve => {
                            let modLogEmbed = new MessageEmbed()
                            .setColor(good)
                            .setTitle(`Member Unbanned | Case #${res.cases}`)
                            .addField(`Member`, userId, true)
                            .addField(`Moderator`, message.author.tag, true)
                            .addField(`Reason`, reason)
                            .setFooter(`${userId}`)
                            .setTimestamp()
                            if (modLogsChan.permissionsFor(client.user.id).has("SEND_MESSAGES")) {
                                if (modLogsChan.permissionsFor(client.user.id).has("EMBED_LINKS")) {
                                    modLogsChan.send(modLogEmbed).then(msg => {
                                        resolve(msg.id);
                                    }).catch(err => err);
                                } else {
                                    let fields = [];
                                    for (let field of embed.fields) {
                                        fields.push(`**${field.name}**: ${field.value}`);
                                    }
                                    let str = `**${embed.title}**\n${fields.join('\n')}\n${embed.footer}`;
                                    modLogsChan.send(str).then(msg => {
                                        resolve(msg.id);
                                    }).catch(error => error);
                                }
                            }
                        });
                    }
                    res.modCases.push({
                        type: "Unban",
                        id: uniqid("unban-(", ")"),
                        case: res.cases,
                        userId: userId,
                        modId: message.author.id,
                        modTag: message.author.tag,
                        reason: reason,
                        embedId: embedId ? embedId : null,
                        happenedAt: Date.now()
                    });
                    await client.functions.saveDB(res).catch(err => console.error(err));
                    client.functions.getEntries("ban").then(async activeBans => {
                        for (let entry of activeBans.entries) {
                            if (entry.guildId == message.guild.id && entry.userId == userId) {
                                let index = activeBans.entries.indexOf(entry);
                                activeBans.entries.splice(index, 1);
                                await activeBans;
                                await client.functions.saveDB(activeBans).catch(err => console.error(err));
                            }
                        }
                    });
                    if (setRes.settings.deleteModCommands === true) message.delete();
                    });
                });
            });
        });
    }
}