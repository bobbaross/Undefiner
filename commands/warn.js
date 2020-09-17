const {MessageEmbed} = require('discord.js');
const {severe,branding} = require('../config.json').colors;
const uniqid = require('uniqid');

module.exports = {
    name: "warn",
    description: "Warn a member.",
    aliases: [],
    category: "moderation",
    usage: "<member> <reason>",
    guildOnly: true,

    async undefine(client, message, args, hasEmbedPerms) {
        client.functions.getDB(message.guild.id).then(async res => {
            if (!res) res = await client.functions.createDB(message.guild.id);
            let bypassRoles = [];
            for (let role of res.modRoles) {
                bypassRoles.push(role);
            }
            for (let role of res.adminRoles) {
                bypassRoles.push(role);
            }
            if (!message.member.hasPermission("MANAGE_MESSAGES") && !bypassRoles.some(r => message.member.roles.cache.has(r))) {
                let embed = new MessageEmbed()
                .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("MANAGE_MESSAGES") ? "Whoops" : "Manage Messages"} amongst your permissions.`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            if (!args[0]) {
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me who to warn.\n${this.name} ${this.usage}`);
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
            await member;
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
            await args.shift();
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
            if (res.settings.dmOnPunished === true) {
                let dmEmbed = new MessageEmbed()
                .setColor(severe)
                .setTitle(`You've been warned in ${message.guild.name}, here is a copy of the log!\nMember Warned | Case #${res.cases}`)
                .addField(`Member`, member.user.tag, true)
                .addField(`Moderator`, message.author.tag, true)
                .addField(`Reason`, reason)
                .setFooter(`${user.id}`)
                .setTimestamp()
                user.send(dmEmbed).catch(err => err);
            }
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`${user.tag} has been warned. ${res.settings.withReason === true ? reason : ""}`);
            if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            var embedId;
            var modLogsChan = await client.functions.getChannel(res.settings.modLogs, message.guild.channels.cache);
            if (modLogsChan || res.settings.modLogs === "there") {
                if (res.settings.modLogs === "there") modLogsChan = message.channel;
                embedId = await new Promise(resolve => {
                    let modLogEmbed = new MessageEmbed()
                    .setColor(severe)
                    .setTitle(`Member Warned | Case #${res.cases}`)
                    .addField(`Member`, member.user.tag, true)
                    .addField(`Moderator`, message.author.tag, true)
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
                type: "Warning",
                id: uniqid("warning-(", ")"),
                case: res.cases,
                userId: user.id,
                userTag: user.tag,
                modId: message.author.id,
                modTag: message.author.tag,
                reason: reason,
                embedId: embedId ? embedId : null,
                happenedAt: Date.now()
            });
            await client.functions.saveDB(res).catch(err => console.error(err));
            if (res.settings.deleteModCommands === true) message.delete();
        });
    }
}