const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "botinfo",
    description: "Get information on the bot.",
    usage: "",
    category: "information",
    aliases: [],

    async undefine(client, message, args) {
        let owner = require('../owner.json');
        let uptime = process.uptime();
        let uptimeString = await client.functions.getStringTime(uptime);
        let version = require('../version.json');
        client.shard.fetchClientValues('guilds.cache.size').then(async results => {
            let embed = new MessageEmbed()
            .setColor(branding)
            .setTitle(`${client.user.name}'s Stats/Info`)
            .addField(`Name`, client.user.name, true)
            .addField(`Owner`, owner, true)
            .addField(`OwnerID`, `266162824529707008`, true)
            .addField(`Server Count`, `${results.reduce((prev, guildCount) => prev + guildCount, 0)} servers`, true)
            .addField(`Vote Count`, `Unavailable: Not add, approved, or set up, to top.gg yet`, true)
            .addField(`Command Count`, `${client.commands.map(cmd => cmd).length} commands`, true)
            .addField(`Uptime`, uptimeString, true)
            .addField(`Version`, `${version.release}.${version.beta}.${version.alpha}.${version.pre_alpha}`, true)
            .addField(`Library`, `Discord.JS`, true)
            .addField(`Website`, `https://aprixstudios.xyz/`, true)
            .addField(`Discord`, `https://discord.gg/k2PEWMw or https://aprx.gq/discord`, true)
            .addField(`GitHub`, `https://github.com/AprixStudios/Undefiner`, true)

            return message.channel.send(embed).catch(err => {
                let arr = [];
                for (let field of embed.fields) {
                    arr.push(`**${field.name}**: ${field.value}`);
                }
                let str = `**${embed.title}**
${arr.join('\n')}`;
                return message.channel.send(str).catch(error => error);
            });
        });
    }
}