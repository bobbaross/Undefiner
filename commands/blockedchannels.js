const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "blockedchannels",
    description: "Get the blocked channels for competitions.",
    usage: "[page]",
    aliases: [],
    category: "competition",
    guildOnly: true,

    async undefine(client, message, args, hasEmbedPerms) {
        client.functions.getCompDB(message.guild.id).then(async res => {
            if (!res) res = await client.functions.createCompDB(message.guild.id);
            var page = args.shift();
            if (page && !isNaN(page)) page = parseInt(page);
            else page = 1;
            if (res.comp.disabledChans.length === 0) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`No channels blocked`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            var items = await client.functions.getPages(res.comp.disabledChans, page);
            var result = [];
            for (let item of items.pages) {
                result.push(`Name: ${message.guild.channels.cache.get(item).name}\nID: ${item}`);
            }
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Current blocked channels:\n${result.join('\n')}\nPage ${items.amount}`)
            if (hasEmbedPerms === true) {
                return message.channel.send(embed).catch(err => err);
            } else {
                return message.channel.send(embed.description).catch(err => err);
            }
        });
    }
}
