const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "temprole",
    description: "Temporarily assign a role to a member.",
    usage: "<member> <duration> <role>",
    aliases: [],
    category: "roles",
    guildOnly: true,

    async undefine(client, message, args, hasEmbedPerms) {
        client.functions.getDB(message.guild.id).then(async res => {
            if (!res) res = await client.functions.createDB(message.guild.id);
            let bypassRoles = [];
            for (let role of res.modRoles) {
                bypassRoles.push(role);
            }
            for (let role of res.adminRoles) {
                bypassRoles.push(role);
            }
            if (!message.member.hasPermission("MANAGE_ROLES") && !bypassRoles.some(r => message.member.roles.cache.has(r))) {
                let embed = new MessageEmbed()
                .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("MANAGE_ROLES") ? "Whoops" : "Manage Roles"} amongst your permissions.`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            if (!client.checks.hasPermission(message.guild?.me, "MANAGE_ROLES")) {
                let embed = new MessageEmbed()
                .setDescription(`Hey, I don't have permissions to Manage Roles! Mind fixing that?`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            if (!args[0]) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`I can't see a single letter said...`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            var user = await client.functions.getUser(args.shift());
            if (!user) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`*singing voice* Tha-at user iisn't avaaailable to meeee\ndid I sing that well? `)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            var member = message.guild.member(user);
            if (!member) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`IIII don't thin-k .. that .. is .. a .. mem-ber... From hereeeeee.\ndid that sound good?`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            var time = args.shift();
            if (!time) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`That timeframe is either so far out of my comprehension, or just not defined.\nPerhaps try one of the following?\n - \`30m\`\n - \`2h\`\n - \`1d\`\n - \`2w\``)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            var dur = await client.functions.setTime(time);
            if (!dur) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`That timeframe is either so far out of my comprehension, or just not a valid time format.\nPerhaps try one of the following?\n - \`30m\`\n - \`2h\`\n - \`1d\`\n - \`2w\``)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            var role = await client.functions.getRole(args.join(' '), message.guild.roles.cache);
            if (!role) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`I don't think that is a role, just saying.`)
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err);
                }
            }
            
        });
    }
}
