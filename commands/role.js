const {MessageEmbed} = require('discord.js');
const {Checks} = require('../functions/checks');

module.exports = {
    name: "role",
    description: "Give or take a role from a member.",
    aliases: [],
    category: "roles",
    usage: "<member> [+|/|-] <role>",
    guildOnly: true,

    async undefine(client, message, args) {
        if(Checks.hasPermission(message.guild.me, "MANAGE_ROLES")) {
            return message.channel.send('yes').catch(err => err);
        } else {
            return message.channel.send('no').catch(err => err);
        }
    }
}