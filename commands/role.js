const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

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
                if (/all/i.test(args[0])) user = "all";
                if (user !== "all") {
                    let embed = new MessageEmbed()
                    .setDescription(`Mind telling me who to change the role for?\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err)
                    }
                }
            } else {
                var member = message.guild.member(user);
            }
            args.shift();
            if (!client.checks.hasPermission(message.guild?.me, "MANAGE_ROLES")) {
                let embed = new MessageEmbed()
                .setDescription(`Hey, I don't have permissions to Manage Roles! Mind fixing that?`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            if (/(\+)|(\/)|(-)/.test(args[0])) {
                var addOrRem = args.shift().match(/(\+)|(\/)|(-)/)[0][0];
            } else {
                var addOrRem = "/";
            }
            var role = await client.functions.getRole(args[0], message.guild.roles.cache);
            if (!role) {
                let embed = new MessageEmbed()
                .setDescription(`Mind telling me the role?`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            if (client.checks.roleHigherOrEqualTo(role, message.member.roles.highest)) {
                let embed = new MessageEmbed()
                .setDescription(`This role is higher than yours though...`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            function doRoleThingy(mem, rle) {
                if (client.checks.memberHigherOrEqualTo(mem, message.guild?.me)) return true;
                if (client.checks.isOwner(mem)) return true;
                if (addOrRem === "+") {mem.roles.add(rle).catch(err => err); return false;}
                else if (addOrRem === "-") {mem.roles.remove(rle).catch(err => err); return false;}
                else if (addOrRem === "/") {
                    if (mem.roles.cache.has(rle)) {mem.roles.remove(rle).catch(err => err); return false;}
                    else if (!mem.roles.cache.has(rle)) {mem.roles.add(rle).catch(err => err); return false;}
                    else return true;
                }
                else return true;
            }
            if (user === "all") {
                var succeededMembers = [];
                var failedMembers = []
                message.guild.members.forEach(mmbr => {
                    doRoleThingy(mmbr, role.id).then(failed => {
                        if (failed === true) failedMembers.push(mmbr.user.tag);
                        else if (failed === false) succeededMembers.push(mmbr.user.tag);
                    });
                });
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`Successfully changed the roles for ${succeededMembers.length} members.\nFailed Members: ${failedMembers.length > 5 ? `${failedMembers.slice(0,5).join('\n')}\nand ${failedMembers.slice(5).length} more...` : `${failedMembers.join('\n')}`}`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            else if (member) {
                doRoleThingy(member, role.id).then(failed => {
                    let embed = new MessageEmbed()
                    .setColor(branding)
                    .setDescription(failed === false ? `Successfully changed the roles for ${member.user.tag}` : `Failed when changing the roles for ${member.user.tag}\n\nWhy did this fail?\n${client.checks.memberHigherOrEqualTo(member, message.guild?.me) || client.checks.isOwner(member) ? `${client.checks.memberHigherOrEqualTo(member, message.guild?.me) ? `\`This member is higher than me, so I can't change their roles.\` ` : ``}${client.checks.isOwner(member) ? `\`This member is the owner, so I am unable to change their roles.\` ` : ``}` : `\`Other unexpected error...\``}`)
                    if (hasEmbedPerms === true) {
                        return message.channel.send(embed).catch(err => err);
                    } else {
                        return message.channel.send(embed.description).catch(err => err);
                    }
                });
            }
        });
    }
}