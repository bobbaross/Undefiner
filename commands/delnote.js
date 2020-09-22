const {MessageEmbed} = require ('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "delnote",
    description: "Delete a note from a member.",
    usage: "<noteid>",
    aliases: [],
    category: "moderation",
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
                if (!message.member.hasPermission("MANAGE_MESSAGES") && !bypassRoles.some(r => message.member.roles.cache.has(r))) {
                    let embed = new MessageEmbed()
                    .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("MANAGE_MESSAGES") ? "Whoops" : "Manage Messages"} amongst your permissions.`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                var noteId = args[0];
                if (!noteId) {
                    let embed = new MessageEmbed()
                    .setDescription(`Mind telling me the note id?\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                var note = res.notes.find(n => n.id === noteId);
                if (!note) {
                    let embed = new MessageEmbed()
                    .setDescription(`That is not a real note id.\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
                let index = res.notes.indexOf(note);
                res.notes.splice(index,1);
                client.functions.saveDB(res).catch(err => console.error(err));
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`Successfully deleted note with id ${note.id} and value ${note.reason}`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            });
        });
    }
}