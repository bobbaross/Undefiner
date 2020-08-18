const {MessageEmbed} = require ('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "delcase",
    description: "Delete a ase from a member.",
    usage: "<caseid>",
    aliases: ['delmodcase', 'delpunishment'],
    category: "moderation",
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
            var CaseId = args[0];
            if (!CaseId) {
                let embed = new MessageEmbed()
                .setDescription(`Mind telling me the Case id?\n${this.name} ${this.usage}`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            var Case = res.modCases.find(c => c.id === CaseId);
            if (!Case) {
                let embed = new MessageEmbed()
                .setDescription(`That is not a real Case id.\n${this.name} ${this.usage}`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            let index = res.modCases.indexOf(Case);
            res.modCases.splice(index,1);
            client.functions.saveDB(res).catch(err => console.error(err));
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Successfully deleted Mod Case with id ${Case.id} and reason ${Case.reason}`)
            if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
        });
    }
}