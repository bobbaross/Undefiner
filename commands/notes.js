const {MessageEmbed} = require ('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "notes",
    description: "Display the notes of a member or the entire server.",
    usage: "[member] [page]",
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
                var notesArr = [];
                var user = await client.functions.getUser(args[0]);
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
                        if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
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
                    return message.channel.send(embed).catch(err => message.channel.send(`No notes found.`).catch(error => error));
                }
                if (!args[0] || args[0] && args[0] <= 0) args[0] = 1;
                var pages = await client.functions.getPages(notesArr, args[0]);
                let embed = new MessageEmbed()
                .setColor(branding)
                .setTitle(`Notes`)
                for (let item of pages.pages) {
                    embed.addField(`${item.id}`, `**Moderator**: ${client.users.cache.get(item.modId) ? client.users.cache.get(item.modId).tag : item.modTag}\n**Member**: ${client.users.cache.get(item.userId) ? client.users.cache.get(item.userId).tag : item.userTag}\n${item.reason}`);
                }
                embed.setFooter(`Page ${pages.amount}`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            });
        });
    }
}