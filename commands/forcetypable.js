const sanitizer = require('@aero/sanitizer');
const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "forcetypable",
    description: "Force a fully typable nickname upon the entire server.",
    aliases: [],
    usage: "",
    category: "manager",
    guildOnly: true,

    async undefine(client, message, args, hasEmbedPerms) {
        client.functions.getDB(message.guild.id).then(async res => {
            if (!res) res = await client.functions.createDB(message.guild.id);
            if (!message.member.hasPermission("MANAGE_GUILD")) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`I doubt you have permission to manage this server, to be honest.`)
                return message.channel.send(embed).catch(err => {
                    message.channel.send(embed.description).catch(error => error);
                });
            }
            if (!message.guild.me.hasPermission("MANAGE_NICKNAMES")) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`I am lacking the Manage Nicknames permission.`)
                return message.channel.send(embed).catch(err => {
                    message.channel.send(embed.description).catch(error => error);
                });
            }
            message.guild.members.fetch().then(async guildMembers => {
                var failedMembers = [];
                guildMembers.filter(member => member.displayName !== sanitizer(member.displayName)).forEach(member => {
                    let newNick = sanitizer(member.displayName);
                    if (message.guild.me.roles.highest.position < member.roles.highest.position || member.user.id === message.guild.ownerID) {
                        failedMembers.push(member.user.tag)
                    } else {
                        if (member.displayName !== newNick) {
                            if (newNick.length > 32) newNick = newNick.slice(0,30);
                            member.setNickname(newNick).catch(err => err);
                        }
                    }
                });
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`Finished!\nFailed Members: ${failedMembers[0] ? failedMembers.join(', ') : "None"}`)
                return message.channel.send(embed).catch(err => {
                    message.channel.send(embed.description).catch(error => error);
                });
            });
        });
    }
}