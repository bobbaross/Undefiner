const { Utils } = require(`../functions/functions.js`);

module.exports = (client, message) => {
    var { commandHandler } = require('../functions/commandhandler.js');
    if (message.channel.type === 'dm') {
        commandHandler(client, message, "undefine ").catch(err => console.error(err));
    } else {
        var { getDB } = new Utils(client);
        getDB(message.guild.id).then(res => {
            if (res && res.prefix) var prefix = res.prefix;
            else var prefix = "undefine ";
            commandHandler(client, message, prefix).catch(err => console.error(err));
        });
    }
}