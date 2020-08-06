const {MessageEmbed} = require('discord.js');
const {Checks} = require('../functions/checks');
const { Utils } = require('../functions/functions');

module.exports = {
    name: "role",
    description: "Give or take a role from a member.",
    aliases: [],
    category: "roles",
    usage: "<member> [+|/|-] <role>",
    guildOnly: true,

    async undefine(client, message, args) {
        if (!Checks.hasPermission(message.guild.me, "MANAGE_ROLES")) {
            let embed = new MessageEmbed()
                .setDescription(`Hey, perhaps sort out my permissions first? I need the Manage Roles permission.`);
                return message.channel.send(embed).catch(err => message.channel.send(embed.description).catch(err => err));
        }
        utils = new Utils(client);
        utils.getDB(message.guild.id).then(async res => {
            if (!res) res = await utils.createDB(message.guild.id);
            let bypassRoles = [];
            for (let role of res.modRoles) {
                bypassRoles.push(role);
            }
            for (let role of res.adminRoles) {
                bypassRoles.push(role);
            }
            if (!Checks.hasPermission(message.member, "MANAGE_ROLES") && !Checks.hasRole(message.member, bypassRoles)) {
                let embed = new MessageEmbed()
                .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("MANAGE_MESSAGES") ? "Whoops" : "Manage Messages"} amongst your permissions.`);
                return message.channel.send(embed).catch(err => message.channel.send(embed.description).catch(err => err));
            }
            if (!args) {
                let embed = new MessageEmbed()
                .setDescription(`Mind telling me who to change the role for?\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => message.channel.send(embed.description).catch(err => err));
            }
            var user = await utils.getUser(args[0]);
            if (!user) {
                if (args[0].search(/all/i) >= 0) user = "all";
            }
        });
    }
}