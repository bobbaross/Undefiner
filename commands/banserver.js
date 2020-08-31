const {MessageEmbed} = require('discord.js');
const {branding, bad} = require ('../config.json').colors;
const uniqid = require('uniqid');

module.exports = {
    name: "banserver",
    description: "Ban a server from using the bot.",
    usage: "<id or invite> <reason>",
    category: "botstaff",
    staffOnly: true,
    auth: "admin",
    aliases: [],

    async undefine(client, message, args, hasEmbedPerms) {
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
        if (server.includes('discord.gg')) {
            let results = await client.shard.broadcastEval(`this.fetchInvite("${server}")`);
            var invite = results.find(invite => invite !== null);
        }
        if (!invite) {
            let results = await client.shard.broadcastEval(`this.guilds.cache.get("${server}")`);
            var theServer = results.find(srv => srv !== null);
        } else {
            if (invite) var theServer = invite.guild;
        }
        if (!theServer) {
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`I am not in that server.`)
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
        client.functions.getStaffDB().then(async res => {
            if (!res) res = await client.functions.createStaffDB();
            res.infractions.push({
                id: uniqid("serverBan-(", ")"),
                server: theServer.id,
                owner: theServer.ownerID,
                ownerTag: theServer.owner?.tag,
                mod: message.author.id,
                modTag: message.author.tag,
                reason: reason
            });
            res.bannedServers.push(theServer.id);
            res.staffCaseNum++;
            client.functions.saveDB(res).then(() => {
                let embed = new MessageEmbed()
                .setColor(bad)
                .setTitle(`Server Banned | Case #${res.staffCaseNum}`)
                .addField(`Server`, `${theServer.name}`, true)
                .addField(`Owner`, `${theServer.owner.tag}`, true)
                .addField(`Moderator`, `${message.author.tag}`, true)
                .addField(`Reason`, `${reason}`)
                client.sendMessageToSupportServerChannel("648040594651742239", embed).catch(err => err);
                client.functions.leaveServer(theServer.id).catch(err => err);
            }).catch(err => err);
        });
    }
}