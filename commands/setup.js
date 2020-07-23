const {MessageEmbed} = require('discord.js');
const { Utils } = require('../functions/functions.js');

module.exports = {
    name: "setup",
    description: "Set up the database for your server. This command is required to avoid massive storage waste.",
    usage: "",
    aliases: ["startup", "start", "startbot", "start-bot", "setup-bot", "set-up", "start-up", "create-db"],
    category: "manager",
    guildOnly: true,

    async undefine(client, message, args) {
        var {createDB,getDB,saveDB} = new Utils(client);
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
            if (res) return message.channel.send(`You don't need to do this anymore.`).catch(err => err);
            var instance = await createDB(message.guild.id);
            saveDB(instance).then(() => {
                return message.channel.send(`Your database has now been set up!`).catch(err => err);
            }).catch(err => console.error(err));
        });
    }
}