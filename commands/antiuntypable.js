const sanitizer = require('@aero/sanitizer');
const {MessageEmbed} = require('discord.js');
const { Utils } = require('../functions/functions');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "antiuntypable",
    description: "Enable or disable anti-untypable names.",
    aliases: [],
    usage: "",
    category: "manager",
    guildOnly: true,

    async undefine(client, message, args) {
        utils = new Utils(client);
        utils.getDB(message.guild.id).then(async res => {
            if (!res) res = await utils.createDB(message.guild.id);
            if (!res.antiUntypable) res.antiUntypable = false;
            var embed;
            switch(res.antiUntypable) {
                case false:
                    res.antiUntypable = true;
                    utils.saveDB(res).catch(err => err);
                    embed = new MessageEmbed()
                    .setColor(branding)
                    .setDescription(`Anti Untypable Successfully Enabled`)
                    message.channel.send(embed).catch(err => {
                        message.channel.send(embed.description).catch(error => error);
                    });
                break;
                case true:
                    res.antiUntypable = false;
                    utils.saveDB(res).catch(err => err);
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