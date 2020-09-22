const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "removemessages",
    description: "Remove messages for members during competitions.",
    usage: "<member> <amount>",
    aliases: [],
    category: "competition",
    guildOnly: true,

    async undefine(client, message, args, hasEmbedPerms) {
        client.functions.getCompDB(message.guild.id).then(async res => {
            if (!res) res = await client.functions.createCompDB(message.guild.id);
            client.functions.getSettingsDB(message.guild.id).then(async setRes => {
                if (!setRes) setRes = await client.functions.createSettingsDB(guild.id);
                let bypassRoles = [];
                for (let role of setRes.adminRoles) {
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
                var user = await client.functions.getUser(args[0]);
                if (!user) {
                    let embed = new MessageEmbed()
                    .setColor(branding)
                    .setDescription(`Could you please tell me the user?`)
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err);
                    }
                }
                if (!message.guild.members.cache.get(user.id)) {
                    let embed = new MessageEmbed()
                    .setColor(branding)
                    .setDescription(`Could you please tell me the member?`)
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).caatch(err => err);
                    }
                }
                args.shift();
                var amount = args.shift();
                if (!amount || isNaN(amount)) {
                    let embed = new MessageEmbed()
                    .setColor(branding)
                    .setDescription(`Please tell me the amount to remove.`)
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err);
                    }
                } else {
                    amount = parseInt(amount);
                }
                if (!res.comp) res.comp = {active: false, ending: 0, prize: "Unset", competers: [], disabledChans: [], disabledChansInvert: false, finishChannel: "0"}
                var instance = res.comp.competers.find(competer => competer.id === user.id);
                if (!instance) {
                    let newInst = {id: user.id, count: amount, lastMsg: 0};
                    res.comp.competers.push(newInst);
                } else {
                    let index = res.comp.competers.indexOf(instance);
                    instance.count-=amount;
                    res.comp.competers.splice(index,1,instance);
                }
                client.functions.saveDB(res);
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`Successfully removed ${amount} messages to ${user.tag}`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            });
        });
    }
}