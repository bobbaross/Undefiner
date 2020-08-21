const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;
const uniqid = require('uniqid');

module.exports = {
    name: "autoresponder",
    description: "Create phrases to auto respond to.",
    usage: "<add/delete> [case sensitive (true/false) default: true] <text to respond to> | <text to respond with>",
    category: "fun",
    aliases: ['autores'],
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
            if (/(true)|(false)/i.test(args[0])) var caseSens = args.shift().toLowerCase() === 'true'; else var caseSens = true;
            if (!args[0]) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`I need to know what to respond to.\n${this.name} ${this.usage}`)
                return message.channel.send(embed).catch(err => message.channel.send(embed.description).catch(error => error));
            }
            var parts = args.join(' ').split(/( \| )+/);
            if (!parts[1]) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`I need to know what to respond with.\n${this.name} ${this.usage}`)
                return message.channel.send(embed).catch(err => message.channel.send(embed.description).catch(error => error));
            }
            parts.splice(1,1);
            var respondTo = parts[0];
            var respondWith = parts[1];
            var respondId = uniqid("autoRes-(", ")");
            if (!res.autoResponses) res.autoResponses = [];
            res.autoResponses.push({id: respondId, madeBy: message.author.id, madeByTag: message.author.tag, caseSens: caseSens, require: respondTo, give: respondWith});
            client.functions.saveDB(res);
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Auto Response Created Successfully!\n**ID**: ${respondId}\n**Case Sensitive**: ${caseSens}\n**Respond To**: ${respondTo}\n**Respond With**: ${respondWith}`)
            if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
        });
    }
}