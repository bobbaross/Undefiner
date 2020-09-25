const {MessageEmbed} = require('discord.js');
const {branding,good} = require('../config.json').colors;
const uniqid = require('uniqid');

module.exports = {
    name: "unbanowner",
    description: "Unban a owner.",
    aliases: [],
    category: "botstaff",
    auth: "admin",
    staffOnly: true,
    usage: "<owner id> <reason>",

    async undefine(client, message, args, hasEmbedPerms) {
        client.functions.getStaffDB().then(async res => {
            if (!res) res = await client.functions.createStaffDB();
            var user = args.shift();
            if (!user) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`Mind telling me which owner to ban?`)
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
            res.infractions.push({
                id: uniqid("ownerUnban-(", ")"),
                owner: user,
                mod: message.author.id,
                modTag: message.author.tag,
                reason: reason
            });
            if (!res.bannedOwners.find(usr => usr === user)) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`That owner isn't banned.`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            let index = res.bannedOwners.indexOf(user);
            res.bannedOwners.splice(index,1);
            res.staffCaseAmount++;
            client.functions.saveDB(res).catch(err => err);
            let embed = new MessageEmbed()
            .setColor(good)
            .setTitle(`Owner Unbanned | Case #${res.staffCaseAmount}`)
            .addField(`Owner`, user, true)
            .addField(`Moderator`, `${message.author} (${message.author.tag} | ${message.author.id})`, true)
            .addField(`Reason`, `${reason}`)
            client.functions.sendMessageToSupportServerChannel("724615821669957673", embed, true).catch(err => err);
            let successEmbed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Successfully unbanned the owner!`)
            if (hasEmbedPerms === true) {
                return message.channel.send(successEmbed).catch(err => err);
            } else {
                return message.channel.send(successEmbed.description).catch(err => err);
            }
        });
    }
}