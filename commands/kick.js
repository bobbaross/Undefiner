const {MessageEmbed} = require('discord.js');
const {dangerous,branding} = require('../config.json').colors;
const uniqid = require('uniqid');

module.exports = {
    name: "kick",
    description: "Kick a member.",
    aliases: ["k"],
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
                if (!message.member.hasPermission("KICK_MEMBERS") && !bypassRoles.some(r => message.member.roles.cache.has(r))) {
                    let embed = new MessageEmbed()
                    .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("KICK_MEMBERS") ? "Whoops" : "Kick Members"} amongst your permissions.`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
                    let embed = new MessageEmbed()
                    .setDescription(`Ehem... Maybe sort my permissions first? I need the Kick Members permissions.`)
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                if (!args[0]) {
                    let embed = new MessageEmbed()
                    .setDescription(`Now you see, there is something called telling me who to kick.\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                var user = await client.functions.getUser(args[0]);
                if (!user) {
                    let embed = new MessageEmbed()
                    .setDescription(`Now you see, there is something called telling me a real member.\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                var member = message.guild.member(user);
                if (!member) {
                    let embed = new MessageEmbed()
                    .setDescription(`Now you see, there is something called telling me a member from this server.\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                if (member.user.id === message.author.id) {
                    let embed = new MessageEmbed()
                    .setDescription(`This isn't a good idea...\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                if (member.roles.highest.position >= message.member.roles.highest.position) {
                    let embed = new MessageEmbed()
                    .setDescription(`Hey, I don't think you should kick them.\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                if (member.roles.cache.some(r => bypassRoles.includes(r.id))) {
                    let embed = new MessageEmbed()
                    .setDescription(`I wouldn't kick that person if I was you.\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                args.shift();
                var reason = args.slice(0).join(' ');
                if (!reason) {
                    let embed = new MessageEmbed()
                    .setDescription(`Wait I don't wanna do this without a reason.\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                res.cases++;
                if (setRes.settings.dmOnPunished === true) {
                    let dmEmbed = new MessageEmbed()
                    .setColor(dangerous)
                    .setTitle(`You've been kicked from ${message.guild.name}, here is a copy of the log!\nMember Kicked | Case #${res.cases}`)
                    .addField(`Member`, member.user.tag, true)
                    .addField(`Moderator`, message.author.tag, true)
                    .addField(`Reason`, reason)
                    .setFooter(`${user.id}`)
                    .setTimestamp()
                    user.send(dmEmbed).catch(err => err);
                }
                member.kick(`Kicked by ${message.author.tag} with reason: ${reason}`).then(async () => {
                    let embed = new MessageEmbed()
                    .setColor(branding)
                    .setDescription(`${user.tag} has been kicked. ${setRes.settings.withReason === true ? reason : ""}`);
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
                            .setColor(dangerous)
                            .setTitle(`Member Kicked | Case #${res.cases}`)
                            .addField(`Member`, user.tag ? `${user} (${user.tag} | ${user.id})` : user.id, true)
                            .addField(`Moderator`, `${message.author} (${message.author.tag} | ${message.author.id})`, true)
                            .addField(`Reason`, reason)
                            .setFooter(`${user.id}`)
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
                        type: "Kick",
                        id: uniqid("kick-(", ")"),
                        case: res.cases,
                        userId: user.id,
                        userTag: user.tag,
                        modId: message.author.id,
                        modTag: message.author.tag,
                        reason: reason,
                        embedId: embedId ? embedId : null,
                        happenedAt: Date.now()
                    });
                    client.functions.saveDB(res).catch(err => console.error(err));
                    if (setRes.settings.deleteModCommands === true) message.delete();
                });
            });
        });
    }
}