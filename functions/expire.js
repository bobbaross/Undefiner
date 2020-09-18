const {MessageEmbed} = require('discord.js');
const {good} = require('../config.json').colors;
const uniqid = require('uniqid');

class Expire {
    constructor (client) {
        this.client = client;
    }

    async unmute(entry) {
        let guild = this.client.guilds.cache.get(entry.guildId);
        if (!guild) return;
        guild.members.fetch(entry.userId).then(async member => {
            if (!member) return;
            this.client.functions.getDB(guild.id).then(async res => {
                if (!member.roles.cache.has(res.settings.mutedRole)) return;
                member.roles.remove(res.settings.mutedRole).then(async () => {
                    res.cases++;
                    let embedId;
                    let modLogs = guild.channels.cache.get(res.settings.modLogs);
                    if (modLogs) {
                        embedId = new Promise(async resolve => {
                            let duration = await this.client.functions.getTime(Date.now()-entry.happenedAt);
                            let embed = new MessageEmbed()
                            .setColor(good)
                            .setTitle(`Member Unmuted | Case #${res.cases}`)
                            .addField(`Member`, member.user.tag, true)
                            .addField(`Moderator`, this.client.user.tag, true)
                            .addField(`Reason`, `Automatic unmute, time expired from case #${entry.servCase}`, true)
                            .setFooter(`This mute lasted ${duration} | ${entry.userId}`)
                            .setTimestamp()

                            modLogs.send(embed).then(msg => resolve(msg.id)).catch(err => err);
                        });
                    }
                    res.modCases.push({
                        type: "Unmute",
                        id: uniqid("unmute-(", ")"),
                        case: res.cases,
                        userId: member.user.id,
                        userTag: member.user.tag,
                        modId: this.client.user.id,
                        modTag: this.client.user.tag,
                        reason: entry.reason,
                        embedId: embedId ? embedId : null,
                        happenedAt: Date.now()
                    });
                    this.client.functions.saveDB(res);
                }).catch(err => console.error(err));
            });
        });
    }

    async unban(entry) {
        let guild = this.client.guilds.cache.get(entry.guildId);
        if (!guild) return;
        guild.fetchBan(entry.userId).then(async ban => {
            if (!ban) return;
            this.client.functions.getDB(guild.id).then(async res => {
                guild.members.unban(ban.user.id).then(async () => {
                    res.cases++;
                    let embedId;
                    let modLogs = guild.channels.cache.get(res.settings.modLogs);
                    if (modLogs) {
                        embedId = new Promise(async resolve => {
                            let duration = await this.client.functions.getTime(Date.now()-entry.happenedAt);
                            let embed = new MessageEmbed()
                            .setColor(good)
                            .setTitle(`Member Unbanned | Case #${res.cases}`)
                            .addField(`Member`, ban.user.tag, true)
                            .addField(`Moderator`, this.client.user.tag, true)
                            .addField(`Reason`, `Automatic unmute, time expired from case #${entry.servCase}`, true)
                            .setFooter(`This ban lasted ${duration} | ${entry.userId}`)
                            .setTimestamp()

                            modLogs.send(embed).then(msg => resolve(msg.id)).catch(err => err);
                        });
                    }
                    res.modCases.push({
                        type: "Unban",
                        id: uniqid("unban-(", ")"),
                        case: res.cases,
                        userId: member.user.id,
                        userTag: member.user.tag,
                        modId: this.client.user.id,
                        modTag: this.client.user.tag,
                        reason: entry.reason,
                        embedId: embedId ? embedId : null,
                        happenedAt: Date.now()
                    });
                    this.client.functions.saveDB(res);
                }).catch(err => console.error(err));
            });
        });
    }

    async unlock(entry) {
        let guild = this.client.guilds.cache.get(entry.guildId);
        if (!guild) return;
        let channel = guild.channels.cache.get(entry.channelId);
        if (!channel) return;
        channel.updateOverwrites(guild.roles.everyone, {
            SEND_MESSAGES: null
        }).catch(err => err);
    }

    async untempRole(entry) {
        let guild = this.client.guilds.cache.get(entry.guildId);
        if (!guild) return;
        guild.members.fetch(entry.userId).then(async member => {
            if (!member) return;
            if (!guild.roles.cache.get(entry.roleId)) return;
            if (!member.roles.cache.has(entry.roleId)) member.roles.add(entry.roleId).catch(err => err);
            else member.roles.remove(entry.roleId).catch(err => err);
        });
    }
    async endComp(entry) {
        let guild = this.client.guilds.cache.get(entry.id);
        if (!guild) return;
        this.client.functions.getDB(guild.id).then(res => {
            if (!res) return;
            if (!res.comp?.active === true) return;
            let endResult = res.comp.competers.sort((a,b) => {return b.count-a.count});
            let winner;
            let winnerInServer = false;
            while (winnerInServer === false && endResult.length !== 0) {
                if (guild.members.cache.get(endResult[0].id)) {
                    winner = endResult[0];
                    winnerInServer = true;
                } else {
                    endResult.shift();
                }
            }
            if (!winner) {
                finalChan?.send(`No one won the competition for ${res.comp.prize}...`).catch(err => err);
            }
            guild.owner?.send(`Your competition for ${res.comp.prize} was won by ${this.client.users.cache.get(winner.id) ? this.client.users.cache.get(winner.id).tag : winner.id} with ${winner.count} messages.`).catch(err => err);
            let winnerUser = this.client.users.cache.get(winner.id);
            winnerUser?.send(`CONGRATS!!! YOU WON THE COMPETITION FOR ${res.comp.prize} IN ${guild.name}!!! YOU SENT ${winner.count} MESSAGES, LEADING UP TO YOUR AMAZING WIN!!!`).catch(err => err);
            let finalChan = guild.channels.cache.get(res.comp.finishChannel);
            finalChan?.send(`CONGRATS TO ${winnerUser ? winnerUser : winner.id} FOR WINNING ${res.comp.prize} BY SENDING A STUNNING ${winner.count} MESSAGES!!!`).catch(err => err);
            res.comp.competers.splice(0, res.comp.competers.length);
            res.comp.active = false;
            this.client.functions.saveDB(res);
        });
    }
}

module.exports = { Expire }