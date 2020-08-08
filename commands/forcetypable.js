const sanitizer = require('@aero/sanitizer');
const {MessageEmbed} = require('discord.js');
const { Utils } = require('../functions/functions');
const {branding} = require('../config.json');

module.exports = {
    name: "forcetypable",
    description: "Force a fully typable nickname upon the entire server.",
    aliases: [],
    usage: "",
    category: "manager",
    guildOnly: true,

    async undefine(client, message, args) {
        utils = new Utils(client);
        utils.getDB(message.guild.id).then(async res => {
            if (!res) res = await utils.createDB(message.guild.id);
            if (!message.member.hasPermission("MANAGE_GUILD")) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`I doubt you have permission to manage this server, to be honest.`)
                return message.channel.send(embed).catch(err => {
                    message.channel.send(embed.description).catch(error => error);
                });
            }
            message.guild.members.fetch().then(async guildMembers => {
                var members = guildMembers.filter(member => member.displayName !== sanitizer(member.displayName));
                var failedMembers = [];
                members.forEach(member => {
                    let newNick = sanitizer(member.displayName);
                    console.log(newNick)
                    member.setNickname(newNick).catch(err => failedMembers.push(member.user.tag));
                });
                await failedMembers;
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