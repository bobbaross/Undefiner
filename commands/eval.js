const Discord = require('discord.js');
const fs = require('fs-extra');

module.exports = {
    name: "eval",
    description: "Runs code on the bot.",
    aliases: [],
    usage: '<code>',
    category: "developer",

    code(client, message, args, isTest) {
        if (message.author.id !== "266162824529707008") return;
        if (!args) return;
        message.channel.send(`Input\n\`\`\`js\n${args.join(' ')}\n\`\`\`\nOutput:\n\`\`\`js\n${eval(args.join(' '))}\n\`\`\``);
    }
}