const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "settings",
    description: "Change the settings for your server.",
    usage: "<setting> <value>",
    aliases: ["config", "configs", "setting"],
    category: "manager",
    guildOnly: true,

    async undefine(client, message, args, hasEmbedPerms) {
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            let oMem = [];
            let errbed = async () => {
                message.guild.members.fetch({ withPresence: true, cache: false }).then(mems => {
                let Mems = mems.map(mem => mem).filter(mem => mem.user.presence.status !== 'offline' && mem.hasPermission('MANAGE_GUILD') && !mem.user.bot);
                Mems.forEach(mem => {
                    oMem.push(mem.user.tag);
                });
            });
            await Promise.all(oMem);
            const errEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setAuthor(`${message.author.tag}`, message.author.avatarURL)
            .setTitle(`Error`)
            .setDescription(`As you do not have permission to do this, please contact one of the following people to do this:\n${oMem.join(' | ')}`)
            .setTimestamp()

            return message.channel.send(errEmbed).catch(err => err);
            }
            return errbed();
        }
        client.functions.getDB(message.guild.id).then(async res => {
            if (!res) {
                res = await client.functions.createDB(message.guild.id);
            }
            var embed;
            if (!args[0]) args[0] = "";
            let isTrue = ['yes', 'true', 'on', 'enable', 'allow', 'approve', 'accept'];
            let isFalse = ['no', 'false', 'off', 'disable', 'disallow', 'disapprove', 'decline'];
            switch (args[0].toLowerCase()) {
                default:
                    let listingRole = res.settings.mutedRole;
                    let listingChan = res.settings.modLogs;
                    embed = new MessageEmbed()
                    .setColor(branding)
                    .setTitle(`Settings`)
                    .addField(`Prefix`, `${res.prefix ? res.prefix : `Hmm... Something doesn't seem right here... Please report this to the developers at the [AprixStudios Discord](https://discord.gg/RpM43Gc)`}\nThis value must be at least 1 letter and at max 10. Spaces can be used.`)
                    .addField(`MutedRole`, `${listingRole ? listingRole : `Not set.`}\nThis value is changable anytime, but will be set automatically upon a mute.`)
                    .addField(`Modlogs`, `${listingChan ? listingChan : res.settings.modLogs}\nSetting this value to a channel will enable mod logs to be sent in that channel.\nSetting this value to \`this\` will make it the current channel\nSetting this value to \`there\` will set it to be in the channel where the command was sent.\nSetting this value to anything not specified in this embed will turn mod logs off.`)
                    .addField(`Respond-With-Reason`, `${res.settings.withReason ? res.settings.withReason : "Whoops"}\nThis will make the bot respond with the reason for a mod case.\nAvailable options:\nEnable: \`${isTrue.join('` `')}\`\nDisable: \`${isFalse.join('` `')}\``)
                    .addField(`Delete-Mod-Commands`, `${res.settings.deleteModCommands ? res.settings.deleteModCommands : "Whoops"}\nThis will make the bot delete moderation command messages.\nAvailable options:\nEnable: \`${isTrue.join('` `')}\`\nDisable: \`${isFalse.join('` `')}\``)
                    .addField(`DM-On-Punishment`, `${res.settings.dmOnPunish ? res.settings.dmOnPunish : `Whoops...`}\nThis will make the bot DM victims a copy of the modlog upon being punished.\nAvailable options:\nEnable: \`${isTrue.join('` `')}\`\nDisable: \`${isFalse.join('` `')}\``)


                    message.channel.send(embed).catch(err => console.error(err));
                    break;
                case "prefix":
                    let newPrefix = args[1];
                    if (!newPrefix) {
                        embed = new MessageEmbed()
                        .setDescription(`I uhh... So what are we changing the prefix to again?\n${this.name} ${this.usage}`);
                        if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                    }
                    if (newPrefix.length > 10) {
                        embed = new MessageEmbed()
                        .setDescription(`The prefix may not be longer than 10 characters.\n${this.name} ${this.usage}`);
                        if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                    }
                    if (message.content.search(/_$/) >= 0) newPrefix = newPrefix.slice(0,-1)+' ';
                    let oldPrefix = await res.prefix;
                    res.prefix = newPrefix;
                    client.functions.saveDB(res).then(() => {
                        embed = new MessageEmbed()
                        .setColor(branding)
                        .setDescription(`Prefix successfully changed from ${oldPrefix} to ${newPrefix}`)
                        if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                    }).catch(err => {
                        console.error(err);
                    });
                    break;
                case "mutedrole":
                    if (!args[1]) {
                        embed = new MessageEmbed()
                        .setDescription(`I might be COMPLETELY wrong, but I highly doubt you specified a role to be honest.\n${this.name} ${this.usage}`);
                        if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                    }
                    let role = await client.functions.getRole(args[1], message.guild.roles);
                    if (!role) role = "0";
                    res.settings.mutedRole = role.id;
                    client.functions.saveDB(res).then(() => {
                        embed = new MessageEmbed()
                        .setColor(branding)
                        .setDescription(`Muted role successfully ${role === "0" ? `reset` : `changed to ${role.name}`}`)
                        if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                    }).catch(err => {
                        console.error(err);
                    });
                    break;
                    case "modlogs":
                        if (!args[1]) {
                            embed = new MessageEmbed()
                            .setDescription(`I may overlook this, but I don't think you specified a channel. At least I don't see anything there.\n${this.name} ${this.usage}`);
                            if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                        }
                        let channel = await client.functions.getChannel(args[1], message.guild.channels.cache);
                        let channelTwo;
                        if (channel) {channel = channel.id; channelTwo = await client.functions.getChannel(args[1], message.guild.channels.cache)}
                        else if (args[1].toLowerCase() === "this") {channel = message.channel.id; channelTwo = await client.functions.getChannel(message.channel.id, message.guild.channels.cache)}
                        else if (args[1].toLowerCase() === "there") {channel = "there"; channelTwo = "there"}
                        else {channel = "off"; channelTwo = "off"}
                        res.settings.modLogs = channel;
                        client.functions.saveDB(res).then(() => {
                            embed = new MessageEmbed()
                            .setColor(branding)
                            .setDescription(`Modlogs successfully ${channelTwo.name ? channel === message.channel.id ? `set to the current channel` : `set to ${channelTwo.name}` : channel === "there" ? `set to the execution channel` : `turned off`}`)
                            if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                        }).catch(err => {
                            console.error(err);
                        });
                    break;
                    case "respond-with-reason":
                        if (isTrue.includes(args[1])) {
                            res.settings.withReason = true;
                            client.functions.saveDB(res).then(() => {
                                embed = new MessageEmbed()
                                .setColor(branding)
                                .setDescription(`Respond with reasons successfully turned on.`)
                                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                            }).catch(err => console.error(err));
                        }
                        else if (isFalse.includes(args[1])) {
                            res.settings.withReason = false;
                            client.functions.saveDB(res).then(() => {
                                embed = new MessageEmbed()
                                .setColor(branding)
                                .setDescription(`Respond with reasons successfully turned off.`)
                                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                            }).catch(err => console.error(err));
                        }
                        else {
                            embed = new MessageEmbed()
                            .setDescription(`I am pretty sure that doesn't tell me to enable or disable this.`);
                            if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                        }
                    break;
                    case "delete-mod-commands":
                        if (isTrue.includes(args[1])) {
                            res.settings.deleteModCommands = true;
                            client.functions.saveDB(res).then(() => {
                                embed = new MessageEmbed()
                                .setColor(branding)
                                .setDescription(`Delete Mod Commands successfully turned on.`)
                                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                            }).catch(err => console.error(err));
                        }
                        else if (isFalse.includes(args[1])) {
                            res.settings.deleteModCommands = false;
                            client.functions.saveDB(res).then(() => {
                                embed = new MessageEmbed()
                                .setColor(branding)
                                .setDescription(`Delete Mod Commands successfully turned off.`)
                                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                            }).catch(err => console.error(err));
                        }
                        else {
                            embed = new MessageEmbed()
                            .setDescription(`I am pretty sure that doesn't tell me to enable or disable this.`);
                            if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                        }
                        break;
                        case "dm-on-punishment":
                            if (isTrue.includes(args[1])) {
                                res.settings.dmOnPunish = true;
                                client.functions.saveDB(res).then(() => {
                                    embed = new MessageEmbed()
                                    .setColor(branding)
                                    .setDescription(`DM On Punishment successfully turned on.`)
                                    if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                                }).catch(err => console.error(err));
                            }
                            else if (isFalse.includes(args[1])) {
                                res.settings.dmOnPunish = false;
                                client.functions.saveDB(res).then(() => {
                                    embed = new MessageEmbed()
                                    .setColor(branding)
                                    .setDescription(`DM On Punishment successfully turned off.`)
                                    if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                                }).catch(err => console.error(err));
                            }
                            else {
                                embed = new MessageEmbed()
                                .setDescription(`I am pretty sure that doesn't tell me to enable or disable this.`);
                                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                            }
            }

        });
    }
}
