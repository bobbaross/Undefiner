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
            var usr = args.shift();
        if (!usr) {
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Mind telling me which owner to ban?`)
            if (hasEmbedPerms === true) {
                return message.channel.send(embed).catch(err => err);
            } else {
                return message.channel.send(embed.description).catch(err => err);
            }
        }
        var user = usr[0];
        if (!user) {
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`I don't know that owner.`)
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
                id: uniqid("ownerUnban-(", ")"),
                owner: user,
                mod: message.author.id,
                modTag: message.author.tag,
                reason: reason
            });
            let index = res.bannedOwners.indexOf(user);
            res.bannedOwners.splice(index,1);
            res.staffCaseNum++;
            client.functions.saveDB(res).then(() => {
                let embed = new MessageEmbed()
                .setColor(good)
                .setTitle(`Owner Unbanned | Case #${res.staffCaseNum}`)
                .addField(`Owner`, `${user}`, true)
                .addField(`Moderator`, `${message.author.tag}`, true)
                .addField(`Reason`, `${reason}`)
                client.functions.sendMessageToSupportServerChannel("724615821669957673", embed).catch(err => err);
            }).catch(err => err);
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