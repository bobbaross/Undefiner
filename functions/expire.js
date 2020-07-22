const {getDB,saveDB,getTime} = new Utils(client);
const {MessageEmbed} = require('discord.js');
const { Utils } = require('./functions');
const {good} = require('../config.json').colors;

class Expire {
    constructor (client) {
        this.client = client;
    }

    async unmute(entry, client) {
        let guild = client.guilds.cache.get(entry.guildId);
        if (!guild) return;
        let member = guild.members.fetch(entry.userId);
        if (!member) return;
        getDB(guild.id).then(res => {
            if (!member.roles.has(res.settings.mutedRole)) return;
            member.roles.remove(res.settings.mutedRole).then(() => {
                res.cases++;
                saveDB(res);
                let modLogs = guild.channels.cache.get(res.settings.modLogs);
                if (!modLogs) return;
                let embed = new MessageEmbed()
                .setColor(good)
                .setTitle(`Member unmuted #${res.cases}`)
                .addField(`Member`, member.user.tag, true)
                .addField(`Moderator`, client.user.tag, true)
                .addField(`Reason`, entry.reason, true)
                .setFooter(`This mute lasted ${getTime(Date.now()-entry.happenedAt)} | ${entry.userId}`)
                .setTimestamp()

                modLogs.send(embed).catch(err => err);
            }).catch(err => console.error(err));
        });
    }

    async unban(entry, client) {
        let guild = client.guilds.cache.get(entry.guildId);
        if (!guild) return;
        let ban = guild.fetchBan(entry.userId);
        if (!ban) return;
        getDB(guild.id).then(res => {
            guild.unban(ban.user.id).then(() => {
                res.cases++;
                saveDB(res);
                let modLogs = guild.channels.cache.get(res.settings.modLogs);
                if (!modLogs) return;
                let embed = new MessageEmbed()
                .setColor(good)
                .setTitle(`Member unbanned #${res.cases}`)
                .addField(`Member`, member.user.tag, true)
                .addField(`Moderator`, client.user.tag, true)
                .addField(`Reason`, entry.reason, true)
                .setFooter(`This ban lasted ${getTime(Date.now()-entry.happenedAt)} | ${entry.userId}`)
                .setTimestamp()

                modLogs.send(embed).catch(err => err);
            }).catch(err => console.error(err));
        });
    }

    async unlock(entry, client) {
        let guild = client.guilds.cache.get(entry.guildId);
        if (!guild) return;
        let channel = guild.channels.cache.get(entry.channelId);
        if (!channel) return;
        channel.overwritePermissions(guild.roles.everyone, {
            SEND_MESSAGES: null
        });
    }

    async untempRole(entry, client) {
        let guild = client.guilds.cache.get(entry.guildId);
        if (!guild) return;
        let member = guild.members.fetch(entry.userId);
        if (!member) return;
        if (!member.roles.has(entry.roleId)) return;
        member.roles.remove(entry.roleId);
    }
}

module.exports = { Expire }