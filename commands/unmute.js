const {MessageEmbed} = require('discord.js');
const {good,branding} = require('../config.json').colors;
const uniqid = require('uniqid');

module.exports = {
    name: "unmute",
    description: "Unmute a member.",
    aliases: ['unsilence', "um"],
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
                if (!message.member.hasPermission("MANAGE_MESSAGES") && !message.member.roles.cache.some(r => bypassRoles.includes(r.id))) {
                    let embed = new MessageEmbed()
                    .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("MANAGE_MESSAGES") ? "Whoops" : "Manage Messages"} amongst your permissions.`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
                    let embed = new MessageEmbed()
                    .setDescription(`Ehem... Maybe sort my permissions first? I need the Manage Roles permissions.`)
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                let mutedRole = await client.functions.getRole(setRes.settings.mutedRole, message.guild.roles.cache);
                if (!mutedRole) {
                    mutedRole = await client.functions.getRole("muted", message.guild.roles.cache);
                }
                if (mutedRole) {
                    setRes.settings.mutedRole = mutedRole.id;
                    await client.functions.saveDB(setRes);
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
                    setRes.settings.mutedRole = await mutedRole.id;
                    await client.functions.saveDB(setRes);
                }
                if (!args[0]) {
                    let embed = new MessageEmbed()
                    .setDescription(`Now you see, there is something called telling me who to unmute.\n${this.name} ${this.usage}`);
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
                    .setDescription(`I don't think this is allowed...\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                if (member.roles.highest.position >= message.member.roles.highest.position) {
                    let embed = new MessageEmbed()
                    .setDescription(`Hey, I don't think you should unmute them.\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                if (member.roles.cache.some(r => bypassRoles.includes(r.id))) {
                    let embed = new MessageEmbed()
                    .setDescription(`I doubt you have the authority to unmute that person.\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                if (!member.roles.cache.has(mutedRole.id)) {
                    let embed = new MessageEmbed()
                    .setDescription(`Uhm... I am pretty sure they're not muted, to be honest.\n${this.name} ${this.usage}`);
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
                if (setRes.settings.dmOnPunished === true) {
                    let dmEmbed = new MessageEmbed()
                    .setColor(bad)
                    .setTitle(`You've been unmuted in ${message.guild.name}, here is a copy of the log!\nMember Unmuted | Case #${res.cases}`)
                    .addField(`Member`, member.user.tag, true)
                    .addField(`Moderator`, message.author.tag, true)
                    .addField(`Reason`, reason)
                    .setFooter(`${user.id}`)
                    .setTimestamp()
                    user.send(dmEmbed).catch(err => err);
                }
                member.roles.remove(mutedRole.id, `Unmuted by ${message.author.tag} with reason: ${reason}`).then(async () => {
                    let embed = new MessageEmbed()
                    .setColor(branding)
                    .setDescription(`${user.tag} has been unmuted. ${setRes.settings.withReason === true ? reason : ""}`);
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
                            .setTitle(`Member Unmuted | Case #${res.cases}`)
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
                        type: "Unmute",
                        id: uniqid("unmute-(", ")"),
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
                    client.functions.getEntries("mute").then(async activeMutes => {
                        for (let entry of activeMutes.entries) {
                            if (entry.guildId == message.guild.id && entry.userId == user.id) {
                                let index = activeMutes.entries.indexOf(entry);
                                activeMutes.entries.splice(index, 1);
                                await activeMutes;
                                await client.functions.saveDB(activeMutes).catch(err => console.error(err));
                            }
                        }
                    });
                    if (setRes.settings.deleteModCommands === true) message.delete();
                });
            });
        });
    }
}
