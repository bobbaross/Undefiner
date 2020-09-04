const Discord = require('discord.js');
const fs = require('fs-extra');

module.exports = (client, message) => {
    async function commands() {
        var { commandHandler } = require('../functions/commandhandler.js');
        if (message.channel.type === 'dm') {
            commandHandler(client, message, "undefine ", null, true).catch(err => console.error(err));
        } else {
            client.functions.getDB(message.guild.id).then(res => {
                if (res && res.prefix) var prefix = res.prefix;
                else var prefix = "undefine ";
                if (res && res.disabledCommands) var disabledCommands = res.disabledCommands;
                else var disabledCommands = null;
                commandHandler(client, message, prefix, disabledCommands, false).catch(err => console.error(err));
            });
        }
    }
    async function tags() {
        if (message.channel.type === 'dm') return;
        client.functions.getDB(message.guild.id).then(res => {
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
                    client.functions.setCleanTitle(message, embed, tagName)
                    embed.setDescription(`${ruleTag.value}\n    ${ruleTag[section]}`)

                    message.channel.send(embed).then(msg => {
                        if (message.mentions.users.first()) msg.edit(`${message.mentions.users.first()}`).catch(err => err);
                    }).catch(err => message.channel.send(embed.description).then(msg => {
                        if (message.mentions.users.first()) msg.edit(`${message.mentions.users.first()}`).catch(err => err);
                    }).catch(err => err));
                break;
                default:
                    embed = new Discord.MessageEmbed()
                    .setColor(tag.color)
                    client.functions.setCleanTitle(message, embed, tagName)
                    embed.setDescription(`${tag.value}`)

                    message.channel.send(embed).then(msg => {
                        if (message.mentions.users.first()) msg.edit(`${message.mentions.users.first()}`).catch(err => err);
                    }).catch(err => message.channel.send(embed.description).then(msg => {
                        if (message.mentions.users.first()) msg.edit(`${message.mentions.users.first()}`).catch(err => err);
                    }).catch(err => err));
            }
        });
    }
    
    async function autoRes() {
        if (!message.guild) return;
        client.functions.getDB(message.guild.id).then(res => {
            if (!res?.autoResponses?.find(response => response.require.toLowerCase() === message.content.toLowerCase())) return;
            var autoResponse = res.autoResponses.find(response => response.require.toLowerCase() === message.content.toLowerCase());
            if (autoResponse?.caseSens === true && autoResponse?.require !== message.content) return;
            return message.channel.send(autoResponse.give);
        });
    }
    commands();
    tags();
    autoRes();
    async function competer() {
        if (!message.guild.id === "724602779053719693") return;
        if (!["724613837461913623", "724613921297661984", "744148473925992518", "746811977984245901"]) return;
        var competers = require('../competers.json');
        if (!competers[message.author.id]) competers[message.author.id] = {tag: message.author.tag, count: 0};
        competers[message.author.id].count++;
        if (competers[message.author.id].tag !== message.author.tag) competers[message.author.id].tag = message.author.tag;
        fs.writeJSON('../competers.json', competers);
    }
    competer();
}