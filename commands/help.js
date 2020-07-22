const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "help",
    description: "Get help on commands.",
    usage: "[command]",
    category: "information",
    aliases: ['commands', 'cmds'],

    undefine(client, message, args) {
        var {getDB} = require('../functions/functions.js');
        var prefix;
        if (message.guild) {
            prefix = new Promise(resolve => {
                getDB(message.guild.id).then(res => {
                    return resolve(res.prefix || "undefine ");
                });
            });
        } else {
            prefix = "undefine"
        }
        var argCmd = args[0];
        if (argCmd) argCmd = argCmd.toLowerCase();
        let command = client.commands.get(argCmd) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(argCmd));
        if (!command) {
            var commands = {
                moderation: [],
                information: [],
                misc: [],
                roles: [],
                developer: []
            };
            client.commands.map(cmd => cmd).forEach(cmd => {
                commands[cmd.category].push(cmd.name);
            });
            for (const category of Object.entries(commands)) {
                if (category[1].length === 0) category[1].push(`None`);
            }
            let embed = new MessageEmbed()
            .setColor(branding)
            .setTitle("Help")
            .setDescription(`<> = required | [] = optional\n${prefix}${this.name} ${this.usage}`)
            .addField(`Moderation`, commands.moderation.join(', '), true)
            .addField(`Information`, commands.information.join(', '), true)
            .addField(`Fun`, commands.fun.join(', '), true)
            .addField(`Roles`, commands.roles.join(', '), true)
            .addField(`Developer`, commands.developer.join(', '), true)

            return message.channel.send(embed).catch(err => err);
        } else if (command) {
            let embed = new MessageEmbed()
            .setColor(branding)
            .setTitle(command.name.slice(0,1).toUpperCase() + command.name.slice(1))
            .setDescription(`${command.description}\n<> = required | [] = optional`)
            .addField(`Usage`, prefix+command.name+' '+command.usage, true)
            .addField(`Category`, command.category.slice(0,1).toUpperCase()+command.category.slice(1), true)
            .addField(`Aliases`, `${command.aliases.length > 0 ? command.aliases.join(', ') : "None" }`)

            return message.channel.send(embed).catch(err => err);
        }
    }
}