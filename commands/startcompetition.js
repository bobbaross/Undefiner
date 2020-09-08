const {MessageEmbed, DataResolver} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "startcompetition",
    description: "Start a activity competition!",
    usage: "<time> [prize]",
    category: "competition",
    aliases: ["startcomp", "comp"],
    guildOnly: true,

    async undefine(client, message, args, hasEmbedPerms) {
        client.functions.getDB(message.guild.id).then(async res => {
            if (!res) res = await client.functions.createDB(message.guild.id);
            let bypassRoles = [];
            for (let role of res.adminRoles) {
                bypassRoles.push(role);
            }
            if (!message.member.hasPermission("MANAGE_GUILD") && !message.member.roles.cache.some(r => bypassRoles.includes(r.id))) {
                let embed = new MessageEmbed()
                .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("MANAGE_GUILD") ? "Whoops" : "Manage Server"} amongst your permissions.`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            let timeArg = args.shift();
            var time = await client.functions.setTime(timeArg);
            if (!time) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`I need to know how long to hold the competition for.`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            var prize = args.join(' ');
            if (!prize) prize = "Unset";
            if (!res.comp) res.comp = {active: false, ending: 0, prize: "Unset", competers: [], disabledChans: [], disabledChansInvert: false, finishChannel: "0", blockedRoles: []}
            res.comp.active = true;
            res.comp.ending = time;
            res.comp.prize = prize;
            client.functions.saveDB(res);
            client.functions.getEntries("comp").then(async entryRes => {
                if (!entryRes) entryRes = await client.functions.createEntries("comp");
                entryRes.entries.push({id: message.guild.id, ending: time});
                client.functions.saveDB(entryRes);
            });
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Successfully started a competition for ${prize} and ends in ${client.functions.getStringTime(time-Date.now())}`)
            if (hasEmbedPerms === true) {
                message.channel.send(embed).catch(err => err);
            } else {
                message.channel.send(embed.description).catch(err => err);
            }
            if (message.guild.channels.cache.get(res.comp.finishChannel)) return;
            return message.channel.send(`Hey! I noticed there isn't a channel set up for me to announce the winner in. Could you please mention one?`).then(mes => {
                async function awaitTheMessage(msgs) {
                    var filter = m => {
                        return m.author.id === message.author.id && m.mentions.channels.first();
                    }
                    message.channel.awaitMessages(filter, {max: 1, time: 60000, errors: ['time']}).then(collected => {
                        var m = collected.first();
                        console.log(m)
                        var channel = m.mentions.channels.first();
                        if (!channel || (channel && channel.permissionFor(client.user.id).has("SEND_MESSAGES"))) {
                            return message.channel.send(`Please input a valid channel. (also make sure I can send messages there)`).then(anotherMsg => {
                                msgs.push(anotherMsg);
                                return awaitTheMessage(msgs);
                            });
                        } else {
                            res.comp.finishChannel = channel.id;
                            client.functions.saveDB(res);
                            for (let msg of msgs) {
                                msg.delete();
                            }
                        }
                    }).catch(err => {console.log(err);message.channel.send(`Time ran out... You can still change this with the \`compchannel\` command.`)});
                }
                awaitTheMessage([mes]);
            }).catch(err => err);
        });
    }
}