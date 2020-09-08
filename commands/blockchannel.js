const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "blockchannel",
    description: "Block a channel from adding messages to the competition. (When blockinvert enabled, this will allow channels instead)",
    aliases: [],
    usage: "<channel>",
    category: "competition",
    guildOnly: true,

    async undefine(client, message, args, hasEmbedPerms) {
        client.functions.getDB(message.guild.id).then(async res => {
            if (!res) res = await client.functions.createDB(message.guild.id);
            let bypassRoles = [];
            for (let role of res.adminRoles) {
                bypassRoles.push(role);
            }
            if (!message.member.hasPermission("MANAGE_GUILD") && !message.member.roles.cache.some(r => bypassRoles.includes(r.id))) {
                let embed = new MessageEmbed()
                .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("MANAGE_GUILD") ? "Whoops" : "Manage Server"} amongst your permissions.`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            var channel = await client.functions.getChannel(args[0], message.guild.channels.cache);
            if (!channel) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`I need to know the channel...`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            if (!res.comp) res.comp = {active: false, ending: 0, prize: "Unset", competers: [], disabledChans: [], disabledChansInvert: false, finishChannel: "0", blockedRoles: []}
            res.comp.disabledChans.push(channel.id);
            client.functions.saveDB(res);
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Successfully blocked ${channel.name} from counting in the competition.`)
            if (hasEmbedPerms === true) {
                return message.channel.send(embed).catch(err => err);
            } else {
                return message.channel.send(embed.description).catch(err => err);
            }
        });
    }
}