const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "unblockchannel",
    description: "Unblock a channel from adding messages to the competition. (When blockinvert enabled, this will disallow channels instead)",
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
            var channel = args[0];
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
            let index = res.comp.disabledChans.indexOf(channel);
            res.comp.disabledChans.splice(index,1);
            client.functions.saveDB(res);
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Successfully unblocked ${message.guild.channels.cache.get(channel) ? message.guild.channels.cache.get(channel).name : channel} from counting in the competition.`)
            if (hasEmbedPerms === true) {
                return message.channel.send(embed).catch(err => err);
            } else {
                return message.channel.send(embed.description).catch(err => err);
            }
        });
    }
}