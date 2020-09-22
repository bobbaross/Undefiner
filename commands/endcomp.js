const {MessageEmbed} = require('discord.js');
const { Expire } = require('../functions/expire');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "endcomp",
    description: "Force end the current ongoing competition.",
    usage: "<channel>",
    aliases: ["endcompetition"],
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
                if (res.comp?.active !== true) {
                    let embed = new MessageEmbed()
                    .setColor(branding)
                    .setDescription(`No current ongoing competition...`)
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err);
                    }
                }
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`Ending competition...`)
                if (hasEmbedPerms === true) {
                    message.channel.send(embed).catch(err => err);
                } else {
                    message.channel.send(embed.description).catch(err => err);
                }
                var expire = new Expire(client);
                client.functions.getEntries("comp").then(entryRes => {
                    if (!entryRes) return;
                    let entries = entryRes.entries;
                    let entry = entries.find(entri => entri.id === message.guild.id);
                    expire.endComp(entry);
                    let index = entryRes.entries.indexOf(entry);
                    entryRes.entries.splice(index,1);
                    client.functions.saveDB(entryRes);
                });
            });
        });
    }
}