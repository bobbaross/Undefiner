const {MessageEmbed} = require ('discord.js');
const { Utils } = require('../functions/functions');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "delnote",
    description: "Delete a note from a member.",
    usage: "<noteid>",
    aliases: [],
    category: "moderation",
    guildOnly: true,

    async undefine(client, message, args) {
        utils = new Utils(client);
        utils.getDB(message.guild.id).then(async res => {
            if (!res) res = await utils.createDB(message.guild.id);
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
                return message.channel.send(embed).catch(err => message.channel.send(embed.description).catch(err => err));
            }
            var noteId = args[0];
            if (!noteId) {
                let embed = new MessageEmbed()
                .setDescription(`Mind telling me the note id?\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => message.channel.send(embed.description).catch(err => err));
            }
            var note = res.notes.find(n => n.id === noteId);
            if (!note) {
                let embed = new MessageEmbed()
                .setDescription(`That is not a real note id.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => message.channel.send(embed.description).catch(err => err));
            }
            let index = res.notes.indexOf(note);
            res.notes.splice(index,1);
            utils.saveDB(res).catch(err => console.error(err));
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Successfully deleted note with id ${note.id} and value ${note.reason}`)
            return message.channel.send(embed).catch(err => message.channel.send(embed.description).catch(err => err));
        });
    }
}