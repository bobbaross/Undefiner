const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "help",
    description: "Get help on commands.",
    usage: "[command]",
    category: "information",
    aliases: ['commands', 'cmds'],

    async undefine(client, message, args) {
        var prefix;
        if (message.guild) {
            prefix = await new Promise(resolve => {
                client.functions.getDB(message.guild.id).then(res => {
                    if (res && res.prefix) return resolve(res.prefix);
                    else return resolve("undefine ");
                });
            });
        } else {
            prefix = "undefine ";
        }
        var argCmd = args[0];
        if (argCmd) argCmd = argCmd.toLowerCase();
        let command = client.commands.get(argCmd) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(argCmd));
        if (!command) {
            var commands = {
                manager: [],
                moderation: [],
                information: [],
                miscellaneous: [],
                roles: [],
                fun: [],
                developer: [],
                botstaff: []
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
            .addField(`Manager`, '`'+commands.manager.join('` | `')+'`', true)
            .addField(`Moderation`, '`'+commands.moderation.join('` | `')+'`', true)
            .addField(`Information`, '`'+commands.information.join('` | `')+'`', true)
            .addField(`Miscellaneous`, '`'+commands.miscellaneous.join('` | `')+'`', true)
            .addField(`Roles`, '`'+commands.roles.join('` | `')+'`', true)
            .addField(`Fun`, '`'+commands.fun.join('` | `')+'`', true)
            if (client.functions.authorized({auth: "mod"}, message.author)) {
                embed.addField(`Bot Staff`, '`'+commands.botstaff.join('` | `')+'`', true);
            }
            if (client.functions.authorized({auth: "dev"}, message.author)) {
                embed.addField(`Developer`, '`'+commands.developer.join('` | `')+'`', true);
            }
            return message.channel.send(embed).catch(err => {
                message.channel.send(`**Help**
<> = required | [] = optional\n${prefix}${this.name} ${this.usage}
**Manager**: ${commands.manager.join(', ')}
**Moderation**: ${commands.moderation.join(', ')}
**Information**: ${commands.information.join(', ')}
**Miscellaneous**: ${commands.miscellaneous.join(', ')}
**Roles**: ${commands.roles.join(', ')}
**Developer**: ${commands.developer.join(', ')}`).catch(error => error);
            });
        } else if (command) {
            let embed = new MessageEmbed()
            .setColor(branding)
            .setTitle(command.name.slice(0,1).toUpperCase() + command.name.slice(1))
            .setDescription(`${command.description}\n<> = required | [] = optional`)
            .addField(`Usage`, prefix+command.name+' '+command.usage, true)
            .addField(`Category`, command.category.slice(0,1).toUpperCase()+command.category.slice(1), true)
            .addField(`Aliases`, `${command.aliases.length > 0 ? command.aliases.join(', ') : "None" }`)

            return message.channel.send(embed).catch(err => {
                message.channel.send(`**${command.name.slice(0,1).toUpperCase() + command.name.slice(1)}**
${command.description}\n<> = required | [] = optional
**Usage**: ${prefix}${command.name} ${command.usage}
**Category**: ${command.category.slice(0,1).toUpperCase()+command.category.slice(1)}
**Aliases**: ${command.aliases > 0 ? command.aliases.join(', ') : "None"}`).catch(error => error);
            });
        }
    }
}