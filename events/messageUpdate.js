const Discord = require('discord.js');

module.exports = (client, oldMessage, newMessage) => {
    async function commands() {
        var { commandHandler } = require('../functions/commandhandler.js');
        if (newMessage.channel.type === 'dm') {
            commandHandler(client, newMessage, "undefine ", null, true).catch(err => console.error(err));
        } else {
            client.functions.getDB(newMessage.guild.id).then(res => {
                if (res && res.prefix) var prefix = res.prefix;
                else var prefix = "undefine ";
                if (res && res.disabledCommands) var disabledCommands = res.disabledCommands;
                else var disabledCommands = null;
                commandHandler(client, newMessage, prefix, disabledCommands, false).catch(err => console.error(err));
            });
        }
    }
    async function tags() {
        if (newMessage.channel.type === 'dm') return;
        client.functions.getDB(newMessage.guild.id).then(res => {
            if (!res) return;
            if (!newMessage.content.toLowerCase().startsWith(res.prefix) || newMessage.author.bot) return;
            let bypassRoles = [];
            for (let role of res.modRoles) {
                bypassRoles.push(role);
            }
            for (let role of res.adminRoles) {
                bypassRoles.push(role);
            }
            if (!newMessage.member.hasPermission("MANAGE_MESSAGES") && !newMessage.member.roles.cache.some(r => bypassRoles.includes(r.id))) return;
            let args = newMessage.content.slice(res.prefix.length).split(/ +/);
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
                    client.functions.setCleanTitle(newMessage, embed, tagName)
                    embed.setDescription(`${ruleTag.value}\n    ${ruleTag[section]}`)

                    newMessage.channel.send(embed).then(msg => {
                        if (message.mentions.users.first()) msg.edit(`${newMessage.mentions.users.first()}`);
                    });
                break;
                default:
                    embed = new Discord.MessageEmbed()
                    .setColor(tag.color)
                    client.functions.setCleanTitle(newMessage, embed, tagName)
                    embed.setDescription(`${tag.value}`)

                    newMessage.channel.send(embed).then(msg => {
                        if (newMessage.mentions.users.first()) msg.edit(`${newMessage.mentions.users.first()}`);
                    });
            }
        });
    }
    commands();
    tags();
}