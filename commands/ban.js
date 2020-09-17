const {MessageEmbed} = require('discord.js');
const {bad,branding} = require('../config.json').colors;
const uniqid = require('uniqid');

module.exports = {
    name: "ban",
    description: "Ban a member.",
    aliases: ['banish'],
    category: "moderation",
    usage: "<member> [time] <reason>",
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
            if (!message.member.hasPermission("BAN_MEMBERS") && !bypassRoles.some(r => message.member.roles.cache.has(r))) {
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
                .setDescription(`Now you see, there is something called telling me who to ban.\n${this.name} ${this.usage}`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            var user = await client.functions.getUser(args[0]);
            if (!user) {
                if (!isNaN(args[0])) {
                    user = {id: args[0]};
                } else {
                    let embed = new MessageEmbed()
                    .setDescription(`Now you see, there is something called telling me a real member.\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
            }
            if (user.username) var member = message.guild.member(user);
            else var member = null;
            /*if (!member) {
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me a member from this server.\n${this.name} ${this.usage}`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }*/
            if (user.id === message.author.id) {
                let embed = new MessageEmbed()
                .setDescription(`This isn't a good idea...\n${this.name} ${this.usage}`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            if (member?.roles.highest.position >= message.member.roles.highest.position) {
                let embed = new MessageEmbed()
                .setDescription(`Hey, I don't think you should ban them.\n${this.name} ${this.usage}`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            if (member?.roles.cache.some(r => bypassRoles.includes(r.id))) {
                let embed = new MessageEmbed()
                .setDescription(`I wouldn't ban that person if I was you.\n${this.name} ${this.usage}`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            await args.shift();
            var time = await client.functions.setTime(args[0]);
            if (time !== null) await args.shift();
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
            var duration = await client.functions.getTime(time-Date.now());
            if (time-Date.now() < 0) duration = null;
            if (res.settings.dmOnPunished === true) {
                let dmEmbed = new MessageEmbed()
                .setColor(bad)
                .setTitle(`You've been banned from ${message.guild.name}, here is a copy of the log!\nMember Banned | Case #${res.cases}`)
                .addField(`Member`, member.user.tag, true)
                .addField(`Moderator`, message.author.tag, true)
                .addField(`Reason`, reason)
                .setFooter(`${duration !== null ? `This ban will last ${duration} | ` : ""}${user.id}`)
                .setTimestamp()
                user.send(dmEmbed).catch(err => err);
            }
            message.guild.members.ban(user.id, `Banned by ${message.author.tag} with reason: ${reason}`).then(async () => {
                client.functions.getEntries("ban").then(async activeBans => {
                    if (!time) return;
                    activeBans.entries.push({
                        servCase: res.cases,
                        guildId: message.guild.id,
                        userId: user.id,
                        time: time,
                        reason: reason,
                        happenedAt: Date.now()
                    });
                    await client.functions.saveDB(activeBans).catch(err => console.error(err));
                });
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`${user.tag ? user.tag : user.id} has been banned. ${res.settings.withReason === true ? reason : ""}`);
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
                        .setColor(bad)
                        .setTitle(`Member Banned | Case #${res.cases}`)
                        .addField(`Member`, user.tag ? user.tag : user.id, true)
                        .addField(`Moderator`, message.author.tag, true)
                        .addField(`Reason`, reason)
                        .setFooter(`${duration !== null ? `This ban will last ${duration} | ` : ""}${user.id}`)
                        .setTimestamp()
                        if (modLogsChan.permissionsFor(client.user.id).has("SEND_MESSAGES")) {
                            if (modLogsChan.permissionsFor(client.user.id).has("EMBED_LINKS")) {
                                modLogsChan.send(modLogEmbed).then(msg => {
                                    resolve(msg.id);
                                }).catch(err => console.log(err));
                            } else {
                                let fields = [];
                                for (let field of embed.fields) {
                                    fields.push(`**${field.name}**: ${field.value}`);
                                }
                                let str = `**${embed.title}**\n${fields.join('\n')}\n${embed.footer}`;
                                modLogsChan.send(str).then(msg => {
                                    resolve(msg.id);
                                }).catch(error => console.log(error));
                            }
                        }
                    });
                }
                res.modCases.push({
                    type: "Ban",
                    id: uniqid("ban-(", ")"),
                    case: res.cases,
                    userId: user.id,
                    userTag: user.tag ? user.tag : null,
                    modId: message.author.id,
                    modTag: message.author.tag,
                    duration: duration ? duration : "Nope",
                    reason: reason,
                    embedId: embedId ? embedId : null,
                    happenedAt: Date.now()
                });
                await client.functions.saveDB(res).catch(err => console.error(err));
                if (res.settings.deleteModCommands === true) message.delete();
            });
        });
    }
}