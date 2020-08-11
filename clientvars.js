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
    client.constantCommands = ["botinfo", "eval", "exec", "help", "prefix", "report", "settings", "setup", "suggest", "togglecommand"]

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

    // Event handler
    try {
        let eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
        for (let file of eventFiles) {
            try {
                let event = require(`./events/${file}`);
                client.on(file.slice(0, -3), event.bind(null, client));
            } catch (error) {
                return console.error(error);
            }
        }
    } catch (error) {
        return console.error(error);
    }

    let presence = require('./functions/presence.js');
    process.on('message', message => {
        if (message === "All Shards Ready") {
            try {
                presence(client);
            } catch (error) {
                console.error(error);
            }
        }
    });
}