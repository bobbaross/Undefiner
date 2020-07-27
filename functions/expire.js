const {MessageEmbed} = require('discord.js');
const {good} = require('../config.json').colors;
const { Utils } = require('./functions');

class Expire {
    constructor (client) {
        this.client = client;
    }

    async unmute(entry) {
    let {getDB,saveDB,getTime} = new Utils(this.client);
        let guild = this.client.guilds.cache.get(entry.guildId);
        if (!guild) return;
        guild.members.fetch(entry.userId).then(member => {
            if (!member) return;
            getDB(guild.id).then(res => {
                if (!member.roles.has(res.settings.mutedRole)) return;
                member.roles.remove(res.settings.mutedRole).then(() => {
                    res.cases++;
                    saveDB(res);
                    let modLogs = guild.channels.cache.get(res.settings.modLogs);
                    if (!modLogs) return;
                    let duration = await getTime(Date.now()-entry.happenedAt);
                    let embed = new MessageEmbed()
                    .setColor(good)
                    .setTitle(`Member unmuted #${res.cases}`)
                    .addField(`Member`, member.user.tag, true)
                    .addField(`Moderator`, this.client.user.tag, true)
                    .addField(`Reason`, entry.reason, true)
                    .setFooter(`This mute lasted ${duration} | ${entry.userId}`)
                    .setTimestamp()

                    modLogs.send(embed).catch(err => err);
                }).catch(err => console.error(err));
            });
        });
    }

    async unban(entry) {
        let {getDB,saveDB,getTime} = new Utils(this.client);
        let guild = this.client.guilds.cache.get(entry.guildId);
        if (!guild) return;
        guild.fetchBan(entry.userId).then(ban => {
            if (!ban) return;
            getDB(guild.id).then(res => {
                guild.unban(ban.user.id).then(() => {
                    res.cases++;
                    saveDB(res);
                    let modLogs = guild.channels.cache.get(res.settings.modLogs);
                    if (!modLogs) return;
                    let duration = await getTime(Date.now()-entry.happenedAt);
                    let embed = new MessageEmbed()
                    .setColor(good)
                    .setTitle(`Member unbanned #${res.cases}`)
                    .addField(`Member`, member.user.tag, true)
                    .addField(`Moderator`, this.client.user.tag, true)
                    .addField(`Reason`, entry.reason, true)
                    .setFooter(`This ban lasted ${duration} | ${entry.userId}`)
                    .setTimestamp()

                    modLogs.send(embed).catch(err => err);
                }).catch(err => console.error(err));
            });
        });
    }

    async unlock(entry) {
        let guild = this.client.guilds.cache.get(entry.guildId);
        if (!guild) return;
        let channel = guild.channels.cache.get(entry.channelId);
        if (!channel) return;
        channel.overwritePermissions(guild.roles.everyone, {
            SEND_MESSAGES: null
        });
    }

    async untempRole(entry) {
        let guild = this.client.guilds.cache.get(entry.guildId);
        if (!guild) return;
        guild.members.fetch(entry.userId).then(member => {
            if (!member) return;
            if (!member.roles.has(entry.roleId)) return;
            member.roles.remove(entry.roleId);
        });
    }
}

module.exports = { Expire }