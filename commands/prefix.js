const {MessageEmbed} = require('discord.js');
const { Utils } = require('../functions/functions');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "settings",
    description: "Change the settings for your server.",
    usage: "<setting> <value>",
    aliases: ["config", "configs", "setting"],
    category: "manager",
    guildOnly: true,

    async undefine(client, message, args) {
        var {createDB,getDB,saveDB} = new Utils(client);
        if (!args[0]) {
            getDB(message.guild.id).then(() => {
                message.channel.send(`The prefix for this server is set to \`${res.prefix}\``).catch(err => err);
            });
        } else {
            if (!message.member.hasPermission('MANAGE_GUILD')) {
                let oMem = [];
                let errbed = async () => {
                    message.guild.members.fetch({ withPresence: true, cache: false }).then(mems => {
                    let Mems = mems.map(mem => mem).filter(mem => mem.user.presence.status !== 'offline' && mem.hasPermission('MANAGE_GUILD') && !mem.user.bot);
                    Mems.forEach(mem => {
                        oMem.push(mem.user.tag);
                    });
                });
                await Promise.all(oMem);
                const errEmbed = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setAuthor(`${message.author.tag}`, message.author.avatarURL)
                .setTitle(`Error`)
                .setDescription(`As you do not have permission to do this, please contact one of the following people to do this:\n${oMem.join(' | ')}`)
                .setTimestamp()

                return message.channel.send(errEmbed).catch(err => err);
                }
                return errbed();
            }
            getDB(message.guild.id).then(async res => {
                if (!res) {
                    res = await createDB(message.guild.id);
                    await saveDB(res);
                }
                var embed;
                let newPrefix = args.slice(0).join(' ');
                if (!newPrefix) {
                    embed = new MessageEmbed()
                    .setDescription(`I uhh... So what are we changing the prefix to again?\n${this.name} ${this.usage}`);
                    return message.channel.send(embed).catch(err => err);
                }
                if (newPrefix.length > 10) return;
                let oldPrefix = await res.prefix;
                res.prefix = newPrefix;
                saveDB(res).then(() => {
                    embed = new MessageEmbed()
                    .setColor(branding)
                    .setDescription(`Prefix successfully changed from ${oldPrefix} to ${newPrefix}`)
                    message.channel.send(embed).catch(err => err);
                }).catch(err => {
                    console.error(err);
                });
            });
        }
    }
}