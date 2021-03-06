const mongoose = require('mongoose');
const { serverID, DB } = require(`./db.js`);
const { entryType, entryDB } = require('./expiredb.js');
const { global, botstaffdb } = require('./botstaffdb.js');
const { compServer, comp } = require('./compdb.js');
const { modServer, modCases } = require('./moddb.js');
const { settingsServer, settings } = require('./settingsdb.js');
const { giveawayServer, giveaways } = require('./giveawaydb.js');
const { webhooksServer, webhooks } = require('./webhooksdb.js');
const Discord = require('discord.js');

class Utils {
    constructor (client) {
        this.client = client;
    }
    
    // Get User Function
    async getUser(mention) {
        return new Promise(resolve => {
            if (!mention) return resolve();
            if (mention.startsWith('<@') && mention.endsWith('>')) {
                // if it is a mention it will do this
                mention = mention.slice(2, -1);
                if (mention.startsWith('!')) {
                    mention = mention.slice(1);
                }
                return resolve(this.client.users.cache.get(mention));
            }
            else if (this.client.users.cache.get(mention)) {
                // if it is a id it will do this
                return resolve(this.client.users.cache.get(mention));
            } else {
                // if it isn't either of them it will do this
                if (this.client.users.cache.find(u => u.tag.toLowerCase().startsWith(mention.toLowerCase()))) {
                    // if it can find a user from the input it will do this
                    return resolve(this.client.users.cache.find(u => u.tag.toLowerCase().startsWith(mention.toLowerCase())));
                }
                else {
                    // if not it wont do anything
                    return resolve();
                }
            }
        });
    }

    // Get Role Function
    async getRole(mention, roles) {
        return new Promise(resolve => {
            if (!mention) return resolve();
            if (mention.startsWith('<@&') && mention.endsWith('>')) {
                // if it is a mention it will do this
                mention = mention.slice(3, -1);
                if (mention.startsWith('!')) {
                    mention = mention.slice(1);
                }
                return resolve(roles.get(mention));
            }
            else if (roles.get(mention)) {
                // if it is a id it will do this
                return resolve(roles.get(mention));
            } else {
                // if it isn't either of them it will do this
                if (roles.find(r => r.name.toLowerCase().startsWith(mention.toLowerCase()))) {
                    // if it can find a role from the input it will do this
                    return resolve(roles.find(r => r.name.toLowerCase().startsWith(mention.toLowerCase())));
                }
                else {
                    // if not it wont do anything
                    return resolve();
                }
            }
        });
    }

    // Get Channel Function
    async getChannel(mention, channels) {
        return new Promise(resolve => {
            if (!mention) return resolve();
            if (mention.startsWith('<#') && mention.endsWith('>')) {
                // if it is a mention it will do this
                mention = mention.slice(2, -1);
                if (mention.startsWith('!')) {
                    mention = mention.slice(1);
                }
                return resolve(channels.get(mention));
            }
            else if (channels.get(mention)) {
                // if it is a id it will do this
                return resolve(channels.get(mention));
            } else {
                // if it isn't either of them it will do this
                if (channels.find(c => c.name.toLowerCase().startsWith(mention.toLowerCase()))) {
                    // if it can find a channel from the input it will do this
                    return resolve(channels.find(c => c.tag.toLowerCase().startsWith(mention.toLowerCase())));
                }
                else {
                    // if not it wont do anything
                    return resolve();
                }
            }
        });
    }

    // Create DB Function
    // it just creates the database for the user... what else do you need to know?
    async createDB(serverid) {
        return new Promise(resolve => {
            let newDB = new DB({
                serverID: `${serverid}`,
                db: "a",
                tempRoles: [],
                persistedRoles: [],
                afkMembers: [],
                tags: [],
                language: "en"
            }, false);
            return resolve(newDB);
        });
    }

    async createCompDB(serverid) {
        return new Promise(resolve => {
            let newDB = new comp({
                compServer: serverid,
                comp: {active: false, ending: 0, prize: "Not Entered", competers: [], disabledChans: [], finishChannel: "0", disabledChansInvert: false, blockedRoles: []}
            });
            return resolve(newDB);
        });
    }

    async createGiveDB(serverid) {
        return new Promise(resolve => {
            let newDB = new giveaways({
                giveawayServer: serverid,
                activeGiveaways: [],
                winners: []
            });
            return resolve(newDB);
        });
    }

    async createModDB(serverid) {
        return new Promise(resolve => {
            let newDB = new modCases({
                modServer: serverid,
                modCases: [],
                lockedChans: [],
                cases: 0,
                notes: [],
            });
            return resolve(newDB);
        });
    }

    async createSettingsDB(serverid) {
        return new Promise(resolve => {
            let newDB = new settings({
                settingsServer: serverid,
                prefix: "undefine ",
                settings: {mutedRole: "", modLogs: "off", withReason: false, deleteModCommands: false, dmOnPunish: false},
                modRoles: [],
                adminRoles: [],
                disabledCommands: [],
                disabledUsers: [],
                disabledChannels: [],
                antiUntypable: false,
                autoResponses: []
            });
            return resolve(newDB);
        });
    }

    async createWebDB(serverid) {
        return new Promise(resolve => {
            let newDB = new webhooks({
                webhooksServer: serverid,
                webhooks: []
            });
            return resolve(newDB);
        });
    }

    async createStaffDB() {
        return new Promise(resolve => {
            let newDB = new botstaffdb({
                botstaffdb: "a",
                global: true,
                bannedServers: [],
                bannedUsers: [],
                bannedOwners: [],
                bannedAdmins: [],
                infractions: [],
                staffCaseAmount: 0
            });
            return resolve(newDB);
        });
    }

    async createEntries(enteryType) {
        return new Promise(resolve => {
            let newDB = new entryDB({
                entrytype: `${enteryType}`,
                entrydb: "a",
                entries: []
            });
            return resolve(newDB);
        });
    }

    // Get DB Function
    // all this function does is just to get the database of the server, sooo...
    async getDB(serverid) {
        return new Promise((resolve, reject) => {
            DB.findOne({
                serverID: serverid
            }, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    async getCompDB(serverid) {
        return new Promise((resolve, reject) => {
            comp.findOne({
                compServer: serverid
            }, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    async getGiveDB(serverid) {
        return new Promise((resolve, reject) => {
            giveaways.findOne({
                giveawayServer: serverid
            }, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    async getModDB(serverid) {
        return new Promise((resolve, reject) => {
            modCases.findOne({
                modServer: serverid
            }, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    async getSettingsDB(serverid) {
        return new Promise((resolve, reject) => {
            settings.findOne({
                settingsServer: serverid
            }, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    async getWebDB(serverid) {
        return new Promise((resolve, reject) => {
            webhooks.findOne({
                webhooksServer: serverid
            }, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    // all this function does is just to get the database of literally the only staff actions document, sooo...
    async getStaffDB() {
        return new Promise((resolve, reject) => {
            botstaffdb.findOne({
                global: true
            }, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    // all this function does is just to get the database of the temporary thingy, sooo...
    async getEntries(enteryType) {
        return new Promise((resolve, reject) => {
            entryDB.findOne({
                entrytype: enteryType
            }, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    // Save DB Function
    // I don't even know what to tell you, it saves the database, there is nothing else to this function
    async saveDB(savedb) {
        savedb.save().then(console.log(`Successfully saved DataBase`)).catch(err => console.error(err));
    }

    // Get Time Function
    getTime(s) {
        // make the variables
        let ms = s % 1000;
        s = (s - ms) / 1000;
        let secs = s % 60;
        s = (s - secs) / 60;
        let mins = s % 60;
        s = (s - mins) / 60
        let hours = s % 24;
        let days = (s - hours) / 24;
    
        // put them together
        // it works I swear
        let displayTime;
        if (secs >= 10) displayTime = secs;
        else if (secs <= 9) displayTime = `0${secs}`;

        if (mins >= 10) displayTime = `${mins}:${displayTime}`;
        else if (mins <= 9) displayTime = `0${mins}:${displayTime}`;

        if (hours >= 10) displayTime = `${hours}:${displayTime}`;
        else if (hours <= 9) displayTime = `0${hours}:${displayTime}`;

        if (days > 0) displayTime = `${days}:${displayTime}`;

        return displayTime;

        //return `${hours}:${mins}:${secs}`;
    }

    getStringTime(s, dontUseMs) {
        // make the variables
        if (dontUseMs !== true) {
            let ms = s % 1000;
            s = (s - ms) / 1000;
        }
        let secs = s % 60;
        s = (s - secs) / 60;
        let mins = s % 60;
        s = (s - mins) / 60
        let hours = s % 24;
        let days = (s - hours) / 24;
    
        // put them together
        // it works I swear
        let displayTime;
        if (secs >= 10) displayTime = secs+" seconds";
        else if (secs <= 9) displayTime = `0${secs} seconds`;

        if (mins >= 10) displayTime = `${mins} minutes ${displayTime}`;
        else if (mins <= 9) displayTime = `0${mins} minutes ${displayTime}`;

        if (hours >= 10) displayTime = `${hours} hours ${displayTime}`;
        else if (hours <= 9) displayTime = `0${hours} hours ${displayTime}`;

        if (days > 0) displayTime = `${days} days ${displayTime}`;

        return displayTime;

        //return `${hours}:${mins}:${secs}`;
    }

    async setTime(time) {
        let times = ['s', 'm', 'h', 'd', 'w'];
        return new Promise(resolve => {
            if (!time || !times.some(letter => time.toLowerCase().endsWith(letter)) || isNaN(time.slice(0,-1))) {
                return resolve(null);
            } else if (times.some(letter => time.toLowerCase().endsWith(letter)) && !isNaN(time.slice(0,-1))) {
                let timeInd;
                let timeAt = time.slice(-1);
                if (timeAt === 's') timeInd = 1000;
                if (timeAt === 'm') timeInd = 60000;
                if (timeAt === 'h') timeInd = 3600000;
                if (timeAt === 'd') timeInd = 86400000;
                if (timeAt === 'w') timeInd = 86400000*7;
                let timeMs = time.slice(0,-1);
                let timeMsAdd = timeMs*timeInd;
                let timeMS = Date.now()+timeMsAdd;
                return resolve(timeMS);
            }
        });
    }

    async getPages(fullArr, pageNum) {
        let multiNum = Math.ceil(pageNum)-1;
        let startNum = multiNum*5;
        let pages = Math.floor(fullArr.length/5) >= multiNum ? fullArr.slice(startNum,startNum+5) : fullArr.slice(0,5);
        await pages;
        let pagesAmount = Math.ceil(fullArr.length/5);
        let pagesObj = {pages: pages, amount: `${pageNum}/${pagesAmount}`};
        return pagesObj;
    }

    async setCleanTitle(message, embed, title) {
        if (!message.content.toLowerCase().endsWith(` -c`) && !message.content.toLowerCase().endsWith(` -clean`)) embed.setTitle(title);
    }

    async setCleanFooter(message, embed, footer) {
        if (!message.content.toLowerCase().endsWith(` -c`) && !message.content.toLowerCase().endsWith(` -clean`)) embed.setFooter(footer);
    }

    async getSupportServerMemberRoles(userid) {
        return new Promise(resolve => {
            this.client.shard.broadcastEval('if (this.guilds.cache.get("724602779053719693")) this.guilds.cache.get("724602779053719693").member("'+userid+'")?.roles.cache').then(results => {
                let roles = results.find(result => result !== null);
                return resolve(roles);
            });
        });
    }

    async sendMessageToSupportServerChannel(channelid, msg, isEmbed) {
        if (isEmbed !== true) {    
            this.client.shard.broadcastEval('if (this.guilds.cache.get("724602779053719693")) this.guilds.cache.get("724602779053719693").channels.cache.get("'+channelid+'").send("'+msg+'")').catch(err => console.error(err));
        } else if (isEmbed === true) {
            this.client.shard.broadcastEval('if (this.guilds.cache.get("724602779053719693")) this.guilds.cache.get("724602779053719693").channels.cache.get("'+channelid+'").send({ embed: '+JSON.stringify(msg)+' })').catch(err => console.error(err));
        }
    }

    async authorized(command, sender) {
        let memberRoles = await this.getSupportServerMemberRoles(sender.id);
        let staffRoles = this.client.staffRoles;
        let minimum = staffRoles[command.auth];
        let roles = [];
        for (let i=minimum.pos;i>=0;i--) {
            let staffRole = Object.entries(staffRoles)[i][1].role;
            roles.push(staffRole);
        }
        if (memberRoles?.some(r => roles.includes(r.id))) {
            return true;
        } else {
            return false;
        }
    }
    async leaveServer(serverid) {
        this.client.shard.broadcastEval('if (this.guilds.cache.get("'+serverid+'")) this.guilds.cache.get("'+serverid+'").leave()').catch(err => console.error(err));
    }
}

module.exports = { Utils }
