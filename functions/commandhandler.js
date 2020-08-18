async function commandHandler(client, message, prefix, disabledCommands) {
    if (!message.guild?.me.hasPermission("SEND_MESSAGES")) return;
    var mentionedBotPrefix = message.content.startsWith(`<@!${client.user.id}> `);
    if (mentionedBotPrefix) prefix = `<@!${client.user.id}> `;
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
    var args = message.content.slice(prefix.length).split(/ +/);
    var commandName = args.shift().toLowerCase();
    var command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    let authorized = command.staffOnly === true ? await client.functions.authorized(command, message.author) : true;
    if (command.staffOnly === true && authorized !== true) return;
    if (command.guildOnly === true && message.channel.type === 'dm') return;
    if (disabledCommands && disabledCommands.includes(commandName)) return;
    var hasEmbedPerms = true;
    if (message.channel.type === 'dm') {}
    else if (!message.guild?.me.hasPermission("EMBED_LINKS")) hasEmbedPerms = false;
    try {
        command.undefine(client, message, args, hasEmbedPerms);
    } catch (error) {
        console.error(error);
        return message.channel.send(`Error: ${error.message}\nPlease contact a developer at the AprixStudios Discord Server (https://www.aprixstudios.xyz/discord) or post on Github at https://github.com/AprixStudios/Undefiner/issues to get this issue solved.`);
    }
}

module.exports = { commandHandler }