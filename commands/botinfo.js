const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "botinfo",
    description: "Get information on the bot.",
    usage: "",
    category: "information",
    aliases: [],

    async undefine(client, message, args, hasEmbedPerms) {
        let fetchEmbed = new MessageEmbed()
        message.channel.send(`Fetching...`).then(async msg => {
            async function cpuUsage(time) {
                let startTime = process.hrtime();
                let startCPU = process.cpuUsage();
                await new Promise(r => setTimeout(r, time));
                let elapsedTime = process.hrtime(startTime);
                let elapsedCPU = process.cpuUsage(startCPU);
                let milliseconds = elapsedTime[0] * 1000 + elapsedTime[1] / 1000000;
                let timings = elapsedCPU.user / 1000 + elapsedCPU.system / 1000;
                let percentage = 100 * timings / milliseconds;
                return percentage;
            }
            let owner = require('../owner.json');
            let uptime = process.uptime();
            let uptimeString = await client.functions.getStringTime(Math.round(uptime), true);
            let version = require('../version.json');
            let cpuusage = await cpuUsage(2000);
            client.shard.fetchClientValues('guilds.cache.size').then(async results => {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setTitle(`${client.user.name}'s Stats/Info`)
                .addField(`Name`, client.user.name, true)
                .addField(`Owner`, owner, true)
                .addField(`OwnerID`, `266162824529707008`, true)
                .addField(`Server Count`, `${results.reduce((prev, guildCount) => prev + guildCount, 0)} servers`, true)
                .addField(`Vote Count`, `Unavailable: Not added, approved, or set up, to top.gg yet`, true)
                .addField(`Command Count`, `${client.commands.map(cmd => cmd).length} commands`, true)
                .addField(`Uptime`, uptimeString, true)
                .addField(`Version`, `${version.release}.${version.beta}.${version.alpha}.${version.pre_alpha}`, true)
                .addField(`Library`, `Discord.JS`, true)
                .addField(`Website`, `https://aprixstudios.xyz/`, true)
                .addField(`Discord`, `https://discord.gg/k2PEWMw or https://aprx.gq/discord`, true)
                .addField(`GitHub`, `https://github.com/AprixStudios/Undefiner`, true)
                .addField(`CPU Cores`, require('os').cpus().length, true)
                .addField(`CPU Usage`, `${cpuusage}%`, true)
                .addField(`Memory Usage`, `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB'}/${Math.round(require('os').totalmem() / 1000000000) + 'GB'}`, true)
                return message.channel.send(embed).then(msg.delete({timeout: 1000})).catch(err => {
                    let arr = [];
                    for (let field of embed.fields) {
                        arr.push(`**${field.name}**: ${field.value}`);
                    }
                    let str = `**${embed.title}**
${arr.join('\n')}`;
                    return message.channel.send(str).then(msg.delete({timeout: 1000})).catch(error => error);
                });
            });
        }).catch(err => err);
    }
}
