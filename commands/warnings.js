const {MessageEmbed} = require ('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "warnings",
    description: "Display the warnings of a member or the entire server.",
    usage: "[member] [page]",
    aliases: [],
    category: "moderation",
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
            if (!message.member.hasPermission("MANAGE_MESSAGES") && !bypassRoles.some(r => message.member.roles.cache.has(r))) {
                let embed = new MessageEmbed()
                .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("MANAGE_MESSAGES") ? "Whoops" : "Manage Messages"} amongst your permissions.`);
                if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
            }
            var warningsArr = [];
            var user = await client.functions.getUser(args[0]);
            if (!user) {
                for (let warning of res.modCases) {
                    if (warning.type === "Warning") warningsArr.push(warning);
                }
            } else {
                var member = message.guild.member(user);
                await member;
                if (!member) {
                    let embed = new MessageEmbed()
                    .setDescription(`Now you see, there is something called telling me a member from this server.\n${this.name} ${this.usage}`);
                    if (hasEmbedPerms === true) {
                    return message.channel.send(embed).catch(err => err);
                } else {
                    return message.channel.send(embed.description).catch(err => err)
                }
                }
                await args.shift();
                for (let warningInstance of res.modCases) {
                    if (warningInstance.userId === member.user.id && warningInstance.type === "Warning") warningsArr.push(warningInstance);
                }
            }
            if (warningsArr <= 0) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`No warnings found.`)
                return message.channel.send(embed).catch(err => message.channel.send(`No warnings found.`).catch(error => error));
            }
            if (!args[0] || args[0] && args[0] <= 0) args[0] = 1;
            var pages = await client.functions.getPages(warningsArr, args[0]);
            let embed = new MessageEmbed()
            .setColor(branding)
            .setTitle(`Warnings`)
            for (let item of pages.pages) {
                embed.addField(`${item.id}`, `**Case**: ${item.case}\n**Moderator**: ${client.users.cache.get(item.modId) ? client.users.cache.get(item.modId).tag : item.modTag}\n**Member**: ${client.users.cache.get(item.userId) ? client.users.cache.get(item.userId).tag : item.userTag}\n${item.reason}\n**Happened at**: ${new Date(item.happenedAt).toString().slice(0,-40)}`);
            }
            embed.setFooter(`Page ${pages.amount}`);
            if (hasEmbedPerms === true) {
                message.channel.send(modLogEmbed).catch(err => err);
            } else {
                let fields = [];
                for (let field of embed.fields) {
                    fields.push(`**${field.name}**: ${field.value}`);
                }
                let str = `**${embed.title}**\n${fields.join('\n')}\n${embed.footer}`;
                message.channel.send(str).catch(error => error);
            }
        });
    }
}