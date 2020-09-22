const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "blockrole",
    description: "Block a role from adding messages to the competition.",
    aliases: [],
    usage: "<role>",
    category: "competition",
    guildOnly: true,

    async undefine(client, message, args, hasEmbedPerms) {
        client.functions.getCompDB(message.guild.id).then(async res => {
            if (!res) res = await client.functions.createCompDB(message.guild.id);
            client.functions.getSettingsDB(message.guild.id).then(async setRes => {
                if (!setRes) setRes = await client.functions.createSettingsDB(guild.id);
                let bypassRoles = [];
                for (let role of setRes.adminRoles) {
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
                var role = await client.functions.getRole(args[0], message.guild.roles.cache);
                if (!role) {
                    let embed = new MessageEmbed()
                    .setColor(branding)
                    .setDescription(`I need to know the role...`)
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err);
                    }
                }
                if (!res.comp) res.comp = {active: false, ending: 0, prize: "Unset", competers: [], disabledChans: [], disabledChansInvert: false, finishChannel: "0", blockedRoles: []}
                res.comp.blockedRoles.push(role.id);
                client.functions.saveDB(res);
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`Successfully blocked ${role.name} from counting in the competition.`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            });
        });
    }
}