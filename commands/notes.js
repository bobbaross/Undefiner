const {MessageEmbed} = require ('discord.js');
const { Utils } = require('../functions/functions');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "notes",
    description: "Display the notes of a member or the entire server.",
    usage: "[member] [page]",
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
                return message.channel.send(embed).catch(err => err);
            }
            var notesArr = [];
            var user = await utils.getUser(args[0]);
            if (!user) {
                for (let note of res.notes) {
                    notesArr.push(note);
                }
            } else {
                var member = message.guild.member(user);
                await member;
                if (!member) {
                    let embed = new MessageEmbed()
                    .setDescription(`Now you see, there is something called telling me a member from this server.\n${this.name} ${this.usage}`);
                    return message.channel.send(embed).catch(err => err);
                }
                await args.shift();
                for (let noteInstance of res.notes) {
                    if (noteInstance.userId === member.user.id) notesArr.push(noteInstance);
                }
            }
            if (notesArr <= 0) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`No notes found.`)
                return message.channel.send(embed).catch(err => err);
            }
            if (!args[0] || args[0] && args[0] <= 0) args[0] = 1;
            var pages = await utils.getPages(notesArr, args[0]);
            let embed = new MessageEmbed()
            .setColor(branding)
            .setTitle(`Notes`)
            for (let item of pages.pages) {
                embed.addField(`${item.id}`, `**Moderator**: ${client.users.cache.get(item.modId) ? client.users.cache.get(item.modId).tag : item.modTag}\n**Member**: ${client.users.cache.get(item.userId) ? client.users.cache.get(item.userId).tag : item.userTag}\n${item.reason}`);
            }
            embed.setFooter(`Page ${pages.amount}`);
            return message.channel.send(embed).catch(err => err);
        });
    }
}