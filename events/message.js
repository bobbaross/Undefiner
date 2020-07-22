const e = require('express');

module.exports = (client, message) => {
    var { commandHandler } = require('../functions/commandhandler.js');
    if (message.channel.type === 'dm') {
        commandHandler(client, message, "undefine ").catch(err => console.error(err));
    } else {
        var { getDB } = require('../functions/functions.js');
        getDB(message.guild.id).then(res => {
            if (res && res.prefix) var prefix = res.prefix;
            else var prefix = "undefine ";
            commandHandler(client, message, prefix).catch(err => console.error(err));
        });
    }
}