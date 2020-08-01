const {MessageEmbed} = require('discord.js');
const weather = require('weather-js');
const { Utils } = require('../functions/functions');

module.exports = {
    name: "weather",
    description: "Get weather information in a certain area.",
    usage: "<C/F> <city name>",
    aliases: [],
    category: "miscellaneous",
    
    async undefine(client, message, args) {
        utils = new Utils(client);
    }
}