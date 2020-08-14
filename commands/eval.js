const Discord = require('discord.js');
const fs = require('fs-extra');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "eval",
    description: "Runs code on the bot.",
    aliases: [],
    usage: '<code>',
    category: "developer",
    staffOnly: true,
    auth: "dev",

    async undefine(client, message, args) {
        try {
            var code = args.join(" ");
            let evaled = await require('util').inspect(eval(code));
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
            evaled = evaled.replace(`${client.token}`, `token`);
            if (evaled.length > 1024) {
              return message.channel.send(`Too long text, eek.`);
            } else {
              message.channel.send({
                embed: {
                  color: branding,
                  fields: [
                    { name: `Input`, value: `\`\`\`js\n${args.join(' ')}\`\`\`` },
                    { name: `Output`, value: `\`\`\`js\n${evaled}\`\`\`` }
                  ]
                }
              });
            }
          } catch (err) {
            message.channel.send({
              embed: {
                color: branding,
                fields: [
                  { name: `Input`, value: `\`\`\`js\n${args.join(' ')}\`\`\`` },
                  { name: `Output`, value: `\`\`\`js\n${err}\`\`\`` }
                ]
              }
            });
          }
    }
}
