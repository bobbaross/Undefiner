const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "autoresponses",
    description: "List the auto responses",
    usage: "[page]",
    category: "fun",
    aliases: [],
    guildOnly: true,

    async undefine(client, message, args, hasEmbedPerms) {
        client.functions.getDB(message.guild.id).then(async res => {
            if (!res) res = await client.functions.createDB(message.guild.id);
            var resArr = [];
            for (let autoRes of res.autoResponses) {
                resArr.push(autoRes);
            }
            if (resArr <= 0) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`No autoresponses found.`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            if (!args[0] || args[0] && args[0] <= 0) args[0] = 1;
            var pages = await client.functions.getPages(resArr, args[0]);
            let embed = new MessageEmbed()
            .setColor(branding)
            .setTitle(`Auto Responses`)
            for (let item of pages.pages) {
                embed.addField(`${item.id}`, `**Made By**: ${client.users.cache.get(item.madeBy) ? client.users.cache.get(item.madeBy).tag : item.madeByTag}\n**Case Sensitive?**: ${item.caseSens === true ? `Yes` : `No`}\n**Resonds To**: ${item.require}\n**Responds With**: ${item.give}`);
            }
            embed.setFooter(`Page ${pages.amount}`);
            if (hasEmbedPerms === true) {
                message.channel.send(embed).catch(err => err);
            } else {
                let fields = [];
                for (let field of embed.fields) {
                    fields.push(`**${field.name}**: ${field.value}`);
                }
                let str = `**${embed.title}**\n${fields.join('\n')}\n${embed.footer}`;
                message.channel.send(str).catch(error => error);
            }
        });
    }
}