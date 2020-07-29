const {MessageEmbed} = require('discord.js');
const { Utils } = require('../functions/functions.js');
const {bad} = require('../config.json').colors;

module.exports = {
    name: "reason",
    description: "Change the reason of a mod case",
    aliases: ['r', 'changereason', 'setreason'],
    category: "moderation",
    usage: "<case id> <reason>",
    guildOnly: true,

    async undefine(client, message, args) {
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
            if (!message.member.hasPermission("MANAGE_MESSAGES") && !message.member.roles.cache.some(r => bypassRoles.includes(r.id))) {
                let embed = new MessageEmbed()
                .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("MANAGE_MESSAGES") ? "Whoops" : "Manage Messages"} amongst your permissions.`);
                return message.channel.send(embed).catch(err => err);
            }
            if (!args[0]) {
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me a case id.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            var caseNum = parseInt(args[0]);
            await args.shift();
            var modCase = res.modCases.find(mc => mc.case === caseNum);
            if (!modCase) {
                let embed = new MessageEmbed()
                .setDescription(`Now you see, there is something called telling me a valid case id.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            console.log(modCase)
            var reason = args.join(' ');
            if (!reason) {
                let embed = new MessageEmbed()
                .setDescription(`Hey! You can't just remove the reason, you know!\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            let index = res.modCases.indexOf(modCase);
            modCase.reason = reason;
            res.modCases.splice(index,1,modCase);
            await utils.saveDB(res).catch(err => console.error(err));
            message.channel.messages.fetch(`${modCase.embedId}`).then(msg => {
                if (!msg) {
                    let embed = new MessageEmbed()
                    .setDescription(`I can't seem to find that message in this channel. You sure you're in the right channel?\n${this.name} ${this.usage}`);
                    return message.channel.send(embed).catch(err => err);
                }
                let oldEmbed = msg.embeds[0];
                let newEmbed = new MessageEmbed()
                .setColor(oldEmbed.hexColor)
                .setTitle(oldEmbed.title)
                .addField(oldEmbed.fields[0].name, oldEmbed.fields[0].value, oldEmbed.fields[0].inline)
                .addField(oldEmbed.fields[1].name, oldEmbed.fields[1].value, oldEmbed.fields[1].inline)
                .addField(`Reason`, `${reason}`, true)
                .setFooter(oldEmbed.footer.text)
                .setTimestamp(oldEmbed.timestamp)

                msg.edit(newEmbed).then(() => {
                    let embed = new MessageEmbed()
                    .setDescription(`Case #${modCase.case} has been updated.`);
                    message.channel.send(embed).catch(err => err);
                }).catch(err => console.error(err));
            });
        });
    }
}