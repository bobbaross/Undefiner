const {MessageEmbed} = require ('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "delautoresponse",
    description: "Delete a autoresponse.",
    usage: "<autoresponseid>",
    aliases: ['delautores', 'delresponse', 'delres'],
    category: "fun",
    guildOnly: true,

    async undefine(client, message, args, hasEmbedPerms) {
        client.functions.getSettingsDB(message.guild.id).then(async res => {
            if (!res) res = await client.functions.createSettingsDB(message.guild.id);
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
            var autoresponseId = args[0];
            if (!autoresponseId) {
                let embed = new MessageEmbed()
                .setDescription(`Mind telling me the autoresponseid?\n${this.name} ${this.usage}`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            var autoresponse = res.autoResponses.find(c => c.id === autoresponseId);
            if (!autoresponse) {
                let embed = new MessageEmbed()
                .setDescription(`That is not a real autoresponseid.\n${this.name} ${this.usage}`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            let index = res.autoResponses.indexOf(autoresponse);
            res.autoResponses.splice(index,1);
            client.functions.saveDB(res).catch(err => console.error(err));
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Successfully deleted AutoResponse with id ${autoresponse.id} and content:\n**Responds to**: ${autoresponse.require}\n**Responds With**: ${autoresponse.give}`)
            if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
        });
    }
}