const exec = require("child_process").exec;

module.exports = {
    name: "exec",
    description: "Runs commands on the VPS.",
    aliases: [],
    usage: '<commands>',
    category: "developer",
    staffOnly: true,
    auth: "dev",

    async undefine(client, message, args, hasEmbedPerms) {
        if (!args) return;
        exec(args.join(' '), (err, out) => {
            if (err) {console.log(err); return message.author.send(err).catch(err => err);}
            if (out) {console.log(out); return message.author.send(out).catch(err => err);}
        });
    }
}