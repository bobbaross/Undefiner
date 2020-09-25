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
        if (theServer.id === "724602779053719693") return;
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
            res.staffCaseAmount++;
            client.functions.saveDB(res).catch(err => err);
            let embed = new MessageEmbed()
            .setColor(bad)
            .setTitle(`Server Banned | Case #${res.staffCaseAmount}`)
            .addField(`Server`, `${theServer.name}`, true)
            .addField(`Owner`, theServer.owner?.tag ? `${theServer.owner} (${theServer.owner.tag} | ${theServer.ownerID})` : theServer.ownerID, true)
            .addField(`Moderator`, `${message.author} (${message.author.tag} | ${message.author.id})`, true)
            .addField(`Reason`, `${reason}`)
            client.functions.sendMessageToSupportServerChannel("724615821669957673", embed, true).catch(err => err);
            client.functions.leaveServer(theServer.id).catch(err => err);
            let successEmbed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Successfully banned the server!`)
            if (hasEmbedPerms === true) {
                return message.channel.send(successEmbed).catch(err => err);
            } else {
                return message.channel.send(successEmbed.description).catch(err => err);
            }
        });
    }
}
