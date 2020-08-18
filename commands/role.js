const {MessageEmbed} = require('discord.js');

module.exports = {
    name: "role",
    description: "Give or take a role from a member.",
    aliases: [],
    category: "roles",
    usage: "<member or all> [+|/|-] <role>",
    guildOnly: true,

    async undefine(client, message, args, hasEmbedPerms) {
        if (!client.checks.hasPermission(message.guild.me, "MANAGE_ROLES")) {
            let embed = new MessageEmbed()
                .setDescription(`Hey, perhaps sort out my permissions first? I need the Manage Roles permission.`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
        }

        client.functions.getDB(message.guild.id).then(async res => {
            if (!res) res = await client.functions.createDB(message.guild.id);
            let bypassRoles = [];
            for (let role of res.modRoles) {
                bypassRoles.push(role);
            }
            for (let role of res.adminRoles) {
                bypassRoles.push(role);
            }
            if (!client.checks.hasPermission(message.member, "MANAGE_ROLES") && !client.checks.hasRole(message.member, bypassRoles)) {
                let embed = new MessageEmbed()
                .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("MANAGE_MESSAGES") ? "Whoops" : "Manage Messages"} amongst your permissions.`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            if (!args[0]) {
                let embed = new MessageEmbed()
                .setDescription(`Mind telling me who to change the role for?\n${this.name} ${this.usage}`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            var user = await client.functions.getUser(args[0]);
            if (!user) {
                if (args[0].search(/all/i) >= 0) user = "all";
                if (user !== "all") {
                    let embed = new MessageEmbed()
                    .setDescription(`Mind telling me who to change the role for?\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                }
            }
            
        });
    }
}