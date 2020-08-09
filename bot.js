const {token,dbuser,dbpass,webhookSecret} = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs-extra');
const mongoose = require('mongoose');

mongoose.connect(`mongodb://${dbuser}:${dbpass}@localhost:27017/undefiner`, {useNewUrlParser: true, useUnifiedTopology: true}).then(console.log(`Database Connected...`)).catch(error => console.error(error));


try {
    let expire = require('./expire.js');
    expire.expire(client);
} catch (error) {
    console.error(error);
}

client.commands = new Discord.Collection();
var commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (let file of commandFiles) {
    let command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
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

client.login(token);