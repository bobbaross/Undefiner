const {MessageEmbed} = require('discord.js');
const {branding,good} = require('../config.json').colors;
const uniqid = require('uniqid');

module.exports = {
    name: "unbanserver",
    description: "Unban a server.",
    aliases: [],
    category: "botstaff",
    auth: "admin",
    staffOnly: true,
    usage: "<server id> <reason>",

    async undefine(client, message, args, hasEmbedPerms) {
        client.functions.getStaffDB().then(async res => {
            if (!res) res = await client.functions.createStaffDB();
            var server = args.shift();
            if (!server) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`Mind telling me which server to ban?`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            var theServer = res.bannedServers.find(srv => srv === server);
            if (!theServer) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`That server isn't banned.`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            var reason = args.join(' ');
            if (!reason) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`Please give me a reason for this.`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            if (!res) res = await client.functions.createStaffDB();
            res.infractions.push({
                id: uniqid("serverUnban-(", ")"),
                server: theServer,
                mod: message.author.id,
                modTag: message.author.tag,
                reason: reason
            });
            let index = res.bannedServers.indexOf(theServer);
            res.bannedServers.splice(index,1);
            res.staffCaseNum++;
            client.functions.saveDB(res).then(() => {
                let embed = new MessageEmbed()
                .setColor(good)
                .setTitle(`Server Unbanned | Case #${res.staffCaseNum}`)
                .addField(`Server`, `${theServer}`, true)
                .addField(`Moderator`, `${message.author.tag}`, true)
                .addField(`Reason`, `${reason}`)
                client.functions.sendMessageToSupportServerChannel("724615821669957673", embed, true).catch(err => err);
            }).catch(err => err);
            let successEmbed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Successfully unbanned the server!`)
            if (hasEmbedPerms === true) {
                return message.channel.send(successEmbed).catch(err => err);
            } else {
                return message.channel.send(successEmbed.description).catch(err => err);
            }
        });
    }
}