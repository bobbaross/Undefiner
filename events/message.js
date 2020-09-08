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
    async function compete() {
        if (message.author.bot) return;
        if (!message.guild) return;
        client.functions.getDB(message.guild.id).then(res => {
            if (!res) return;
            if (message.content.toLowerCase().startsWith(res.prefix.toLowerCase())) return;
            if (res.comp?.active !== true) return;
            if (res.comp.blockedRoles.some(r => message.member.roles.cache.has(r))) return;
            if ((res.comp.disabledChansInvert === false && res.comp.disabledChans.some(c => message.channel.id === c)) || (res.comp.disabledChansInvert === true && !res.comp.disabledChans.some(c => message.channel.id === c))) return;
            var competer = res.comp.competers.find(competer => competer.id === message.author.id);
            if (!competer) res.comp.competers.push({id: message.author.id, count: 1, lastMsg: Date.now()});
            else {
                if (Date.now()-3000 < competer.lastMsg) return;
                let index = res.comp.competers.indexOf(competer);
                competer.count++;
                competer.lastMsg = Date.now()
                res.comp.competers.splice(index,1,competer);
            }
            client.functions.saveDB(res);
        });
    }
    compete();
    commands();
    tags();
    autoRes();
    async function competer() {
        if (message.channel.type === 'dm') return;
        if (!message.guild.id === "724602779053719693") return;
        if (!["724613837461913623", "724613921297661984", "744148473925992518", "746811977984245901"].some(id => message.channel.id === id)) return;
        var competers = require('../competers.json');
        if (!competers[message.author.id]) competers[message.author.id] = {tag: message.author.tag, count: 0};
        competers[message.author.id].count++;
        if (competers[message.author.id].tag !== message.author.tag) competers[message.author.id].tag = message.author.tag;
        console.log(`Added a message for ${message.author.tag}`);
        fs.writeJSON('./competers.json', competers);
    }
    competer();
}