async function commandHandler(client, message, prefix, disabledCommands) {
    var mentionedBotPrefix = message.content.startsWith(`<@!${client.user.id}> `);
    if (mentionedBotPrefix) prefix = `<@!${client.user.id}> `;
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
    var args = message.content.slice(prefix.length).split(/ +/);
    var commandName = args.shift().toLowerCase();
    var command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    if (command.guildOnly === true && message.channel.type === 'dm') return;
    if (disabledCommands && disabledCommands.includes(commandName)) return;
    try {
        command.undefine(client, message, args);
    } catch (error) {
        console.error(error);
        return message.channel.send(`Error: ${error.message}\nPlease contact a developer at the AprixStudios Discord Server (https://www.aprixstudios.xyz/discord) or post on Github at https://github.com/AprixStudios/Undefiner/issues to get this issue solved.`);
    }
}

module.exports = { commandHandler }