const Discord = require('discord.js');
const { Utils } = require(`../functions/functions.js`);

module.exports = (client, message) => {
    utils = new Utils(client);
    async function commands() {
        var { commandHandler } = require('../functions/commandhandler.js');
        if (message.channel.type === 'dm') {
            commandHandler(client, message, "undefine ").catch(err => console.error(err));
        } else {
            utils.getDB(message.guild.id).then(res => {
                if (res && res.prefix) var prefix = res.prefix;
                else var prefix = "undefine ";
                commandHandler(client, message, prefix).catch(err => console.error(err));
            });
        }
    }
    async function tags() {
        if (message.channel.type === 'dm') return;
        utils.getDB(message.guild.id).then(res => {
            if (!res) return;
            if (!message.content.toLowerCase().startsWith(res.prefix) || message.author.bot) return;
            let bypassRoles = [];
            for (let role of res.modRoles) {
                bypassRoles.push(role);
            }
            for (let role of res.adminRoles) {
                bypassRoles.push(role);
            }
            if (!message.member.hasPermission("MANAGE_MESSAGES") && !message.member.roles.cache.some(r => bypassRoles.includes(r.id))) return;
            let args = message.content.slice(res.prefix.length).split(/ +/);
            let tagName = args.shift();
            let tag = res.tags.find(t => t.name === tagName);
            if (!tag) return;
            let embed;
            switch(tag.name) {
                case "rule":
                    let rule = args.shift();
                    if (!rule || !tag[rule]) rule = "1";
                    let section = args.shift();
                    if (!section || !tag[rule][section]) section = "all";
                    let ruleTag = tag[rule];
                    embed = new Discord.MessageEmbed()
                    .setColor(ruleTag.color)
                    utils.setCleanTitle(message, embed, tagName)
                    embed.setDescription(`${ruleTag.value}\n    ${ruleTag[section]}`)

                    message.channel.send(embed).then(msg => {
                        if (message.mentions.users.first()) msg.edit(`${message.mentions.users.first()}`);
                    });
                break;
                default:
                    embed = new Discord.MessageEmbed()
                    .setColor(tag.color)
                    utils.setCleanTitle(message, embed, tagName)
                    embed.setDescription(`${tag.value}`)

                    message.channel.send(embed).then(msg => {
                        if (message.mentions.users.first()) msg.edit(`${message.mentions.users.first()}`);
                    });
            }
        });
    }
    commands();
    tags();
}