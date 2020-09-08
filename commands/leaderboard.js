const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "leaderboard",
    description: "Get the current leaderboard for the current competition.",
    usage: "[page]",
    aliases: ["lb"],
    category: "competition",
    guildOnly: true,

    async undefine(client, message, args, hasEmbedPerms) {
        client.functions.getDB(message.guild.id).then(async res => {
            if (!res) res = await client.functions.createDB(message.guild.id);
            if (res.comp?.active === true) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`No competition active.`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            var page = args.shift();
            if (page && !isNaN(page)) page = parseInt(page);
            else page = 1;
            if (res.comp.competers.length === 0) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`No messages tracked so far...`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            var sortedTop = res.comp.competers.filter(item => message.guild.members.cache.get(item.id)).sort((a,b) => {return b.count-a.count});
            var items = client.functions.getPages(sortedTop, page);
            var result = [];
            for (let item of items) {
                let index = sortedTop.indexOf(item);
                result.push(`**#${index}**\n**Member**: ${client.users.cache.get(item.id) ? client.users.cache.get(item.id).tag : item.id}\n**Messages**: ${item.count}`);
            }
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Ending in ${client.functions.getStringTime(res.comp.ending-Date.now())}\nCurrent lead of the **${res.comp.prize}** competition:\n${result.join('\n\n')}`)
            if (hasEmbedPerms === true) {
                return message.channel.send(embed).catch(err => err);
            } else {
                return message.channel.send(embed.description).catch(err => err);
            }
        });
    }
}