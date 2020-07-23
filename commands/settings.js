const {MessageEmbed} = require('discord.js');
const { Utils } = require('../functions/functions');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "settings",
    description: "Change the settings for your server.",
    usage: "<setting> <value>",
    aliases: ["config", "configs", "setting"],
    category: "manager",
    guildOnly: true,

    async undefine(client, message, args) {
        var {createDB,getDB,saveDB,getChannel,getRole} = new Utils(client);
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
            const errEmbed = new Discord.MessageEmbed()
            .setColor('#ff0000')
            .setAuthor(`${message.author.tag}`, message.author.avatarURL)
            .setTitle(`Error`)
            .setDescription(`As you do not have permission to do this, please contact one of the following people to do this:\n${oMem.join(' | ')}`)
            .setTimestamp()

            return message.channel.send(errEmbed).catch(err => err);
            }
            return errbed();
        }
        getDB(message.guild.id).then(async res => {
            if (!res) {
                res = await createDB(message.guild.id);
                await saveDB(res);
            }
            var embed;
            var value;
            if (!args[0]) args[0] = "";
            switch (args[0].toLowerCase()) {
                default:
                    embed = new MessageEmbed()
                    .setColor(branding)
                    .setTitle(`Settings`)
                    .addField(`Prefix`, `${res.prefix ? res.prefix : `Hmm... Something doesn't seem right here... Please report this to the developers at the [AprixStudios Discord](https://discord.gg/RpM43Gc)`}\nThis value must be at least 1 letter and at max 10. Spaces can be used.`)
                    .addField(`Muted Role`, `${getRole(res.settings.mutedRole, message.guild.roles).name ? getRole(res.settings.mutedRole, message.guild.roles).name : `Not set.`}\nThis value is changable anytime, but will be set automatically upon a mute.`)
                    .addField(`Modlogs`, `${getChannel(res.settings.modLogs, message.guild.channels).name ? getChannel(res.settings.modLogs, message.guild.channels).name : res.settings.modLogs}\nSetting this value to a channel will enable mod logs to be sent in that channel.\nSetting this value to \`this\` will make it the current channel\nSetting this value to \`there\` will set it to be in the channel where the command was sent.\nSetting this value to anything not specified in this embed will turn mod logs off.`)

                    message.channel.send(embed).catch(err => err);
                    break;
                case "prefix":
                    let newPrefix = args.slice(1).join(' ');
                    if (!newPrefix) {
                        embed = new MessageEmbed()
                        .setDescription(`I uhh... So what are we changing the prefix to again?\n${this.name} ${this.usage}`);
                        return message.channel.send(embed).catch(err => err);
                    }
                    if (newPrefix.length > 10) return;
                    let oldPrefix = await res.prefix;
                    res.prefix = newPrefix;
                    saveDB(res).then(() => {
                        embed = new MessageEmbed()
                        .setColor(branding)
                        .setDescription(`Prefix successfully changed from ${oldPrefix} to ${newPrefix}`)
                        message.channel.send(embed).catch(err => err);
                    }).catch(err => {
                        console.error(err);
                    });
                    break;
                case "mutedrole":
                    if (!args[1]) {
                        embed = new MessageEmbed()
                        .setDescription(`I might be COMPLETELY wrong, but I highly doubt you specified a role to be honest.\n${this.name} ${this.usage}`);
                        return message.channel.send(embed).catch(err => err);
                    }
                    let role = await getRole(args[1], message.guild.roles);
                    if (role) role = role.id;
                    else role = "0";
                    res.settings.mutedRole = role;
                    saveDB(res).then(() => {
                        embed = new MessageEmbed()
                        .setColor(branding)
                        .setDescription(`Muted role successfully ${role === "0" ? `reset` : `changed to ${await getRole(args[1], message.guild.roles).name}`}`)
                        message.channel.send(embed).catch(err => err);
                    }).catch(err => {
                        console.error(err);
                    });
                    break;
                    case "modlogs":
                        if (!args[1]) {
                            embed = new MessageEmbed()
                            .setDescription(`I may overlook this, but I don't think you specified a channel. At least I don't see anything there.\n${this.name} ${this.usage}`);
                            return message.channel.send(embed).catch(err => err);
                        }
                        let channel = await getChannel(args[1], message.guild.channels);
                        if (channel) channel = channel.id;
                        else if (args[1].toLowerCase() === "this") channel = message.channel.id;
                        else if (args[1].toLowerCase() === "there") channel = "there";
                        else channel = "off";
                        res.settings.modLogs = channel;
                        saveDB(res).then(() => {
                            embed = new MessageEmbed()
                            .setColor(branding)
                            .setDescription(`Modlogs successfully ${getChannel(args[1], message.guild.channels).name ? channel === message.channel.id ? `set to the current channel` : `set to ${getChannel(args[1], message.guild.channels).name}` : channel === "there" ? `set to the execution channel` : `turned off`}`)
                            message.channel.send(embed).catch(err => err);
                        }).catch(err => {
                            console.error(err);
                        });
            }

        });
    }
}