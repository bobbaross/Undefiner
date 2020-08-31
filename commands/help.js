const {MessageEmbed} = require('discord.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "help",
    description: "Get help on commands.",
    usage: "[command]",
    category: "information",
    aliases: ['commands', 'cmds'],

    async undefine(client, message, args, hasEmbedPerms) {
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
            let isMod = await client.functions.authorized({auth: "mod"}, message.author);
            if (isMod === true) {
                embed.addField(`Bot Staff`, '`'+commands.botstaff.join('` | `')+'`');
            }
            let isDev = await client.functions.authorized({auth: "dev"}, message.author);
            if (isDev === true) {
                embed.addField(`Developer`, '`'+commands.developer.join('` | `')+'`');
            }
            if (hasEmbedPerms === true) {
            return message.channel.send(embed).catch(err => err)
            } else {
                let fields = [];
                for (let field of embed.fields) {
                    fields.push(`**${field.name}**: ${field.value}`);
                }
                let str = `**${embed.title}**\n${fields.join('\n')}`;
                return message.channel.send(str).catch(error => error);
            }
        } else if (command) {
            let isStaff = await client.functions.authorized({auth: command.auth}, message.author);
            if (isStaff === false) {
                args = [];
                try {
                    this.undefine(client, messsage, args, hasEmbedPerms);
                } catch (error) {
                    console.error(error);
                } finally {
                    return;
                }
            }
            let embed = new MessageEmbed()
            .setColor(branding)
            .setTitle(command.name.slice(0,1).toUpperCase() + command.name.slice(1))
            .setDescription(`${command.description}\n<> = required | [] = optional`)
            .addField(`Usage`, prefix+command.name+' '+command.usage, true)
            .addField(`Category`, command.category.slice(0,1).toUpperCase()+command.category.slice(1), true)
            .addField(`Aliases`, `${command.aliases.length > 0 ? '`'+command.aliases.join('` | `')+'`' : "None" }`)

            if (hasEmbedPerms === true) {
            return message.channel.send(embed).catch(err => err)
            } else {
                let fields = [];
                for (let field of embed.fields) {
                    fields.push(`**${field.name}**: ${field.value}`);
                }
                let str = `**${embed.title}**\n${fields.join('\n')}`;
                return message.channel.send(str).catch(error => error);
            }
        }
    }
}