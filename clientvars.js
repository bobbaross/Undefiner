const Discord = require('discord.js');
const fs = require('fs-extra');
const { Utils } = require('./functions/functions');
const { Checks } = require('./functions/checks');

module.exports = (client) => {
    utils = new Utils(client);
    var version = require('./version.json');
    client.functions = utils;
    client.checks = Checks;
    client.version = version;
    client.commands = new Discord.Collection();
    client.languages = new Discord.Collection();

    var commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
    for (let file of commandFiles) {
        let command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }

    var langFiles = fs.readdirSync('./languages/').filter(file => file.endsWith('.js'));
    for (let file of langFiles) {
        let lang = require(`./languages/${file}`);
        client.languages.set(lang.lang, lang)
    }

    try {
        let expire = require('./expire.js');
        expire.expire(client);
    } catch (error) {
        console.error(error);
    }
}