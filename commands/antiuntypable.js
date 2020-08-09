const sanitizer = require('@aero/sanitizer');
const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "antiuntypable",
    description: "Enable or disable anti-untypable names.",
    aliases: [],
    usage: "",
    category: "manager",
    guildOnly: true,

    async undefine(client, message, args) {
        client.functions.getDB(message.guild.id).then(async res => {
            if (!res) res = await client.functions.createDB(message.guild.id);
            if (!message.member.hasPermission("MANAGE_GUILD")) {
                let embed = new MessageEmbed()
                .setColor(branding)
                .setDescription(`I don't see Manage Guild amongst your permissions.`)
                return message.channel.send(embed).catch(err => {
                    message.channel.send(embed.description).catch(error => error);
                });
            }
            if (!res.antiUntypable) res.antiUntypable = false;
            var embed;
            switch(res.antiUntypable) {
                case false:
                    res.antiUntypable = true;
                    client.functions.saveDB(res).catch(err => err);
                    embed = new MessageEmbed()
                    .setColor(branding)
                    .setDescription(`Anti Untypable Successfully Enabled`)
                    message.channel.send(embed).catch(err => {
                        message.channel.send(embed.description).catch(error => error);
                    });
                break;
                case true:
                    res.antiUntypable = false;
                    client.functions.saveDB(res).catch(err => err);
                    embed = new MessageEmbed()
                    .setColor(branding)
                    .setDescription(`Anti Untypable Successfully Disabled`)
                    message.channel.send(embed).catch(err => {
                        message.channel.send(embed.description).catch(error => error);
                    });
            }
        });
    }
}