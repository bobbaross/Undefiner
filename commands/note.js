const {MessageEmbed} = require('discord.js');
const { Utils } = require('../functions/functions.js');
const {severe} = require('../config.json').colors;
const uniqid = require('uniqid');

module.exports = {
    name: "note",
    description: "Add a note to a member.",
    aliases: [],
    category: "moderation",
    usage: "<member> <note>",
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
                return message.channel.send(embed).catch(err => err);
            }
            if (!args[0]) {
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me who to note.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            var user = await utils.getUser(args[0]);
            if (!user) {
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me a real member.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            var member = message.guild.member(user);
            await member;
            if (!member) {
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me a member from this server.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            await args.shift();
            var note = args.slice(0).join(' ');
            if (!note) {
                let embed = new MessageEmbed()
                .setDescription(`I hope you don't mind me asking but... What is the note?\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            let embed = new MessageEmbed()
            .setDescription(`Successfully added note for ${user.tag}`);
            message.channel.send(embed).catch(err => err);
            res.notes.push({
                id: uniqid("note-(", ")"),
                userId: user.id,
                userTag: user.tag,
                modId: message.author.id,
                modTag: message.author.tag,
                reason: reason,
                happenedAt: Date.now()
            });
            await utils.saveDB(res).catch(err => console.error(err));
        });
    }
}