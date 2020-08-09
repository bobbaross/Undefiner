const exec = require("child_process").exec;

module.exports = {
    name: "exec",
    description: "Runs commands on the VPS.",
    aliases: [],
    usage: '<commands>',
    category: "developer",

    async undefine(client, message, args) {
        if (message.author.id !== "266162824529707008") return;
        if (!args) return;
        exec(args.join(' '), (err, out) => {
            if (err) {console.log(err); return message.author.send(err).catch(err => err);}
            if (out) {console.log(out); return message.author.send(out).catch(err => err);}
        });
    }
}