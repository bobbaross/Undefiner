const mongoose = require('mongoose');
const { userID, DB } = require(`./db.js`);
const { entryType, entryDB } = require('./expiredb.js');

// Get User Function
async function getUser(mention, client) {
    return new Promise(resolve => {
        if (!mention) return;
        if (mention.startsWith('<@') && mention.endsWith('>')) {
            // if it is a mention it will do this
            mention = mention.slice(2, -1);
            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }
            return resolve(client.users.cache.get(mention));
        }
        else if (client.users.cache.get(mention)) {
            // if it is a id it will do this
            return resolve(client.users.cache.get(mention));
        } else {
            // if it isn't either of them it will do this
            if (client.users.cache.find(u => u.tag.toLowerCase().startsWith(mention.toLowerCase()))) {
                // if it can find a user from the input it will do this
                return resolve(client.users.cache.find(u => u.tag.toLowerCase().startsWith(mention.toLowerCase())));
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
async function createDB(serverid) {
    return new Promise(resolve => {
        let newDB = new DB({
            serverID: `${serverid}`,
            db: "a",
            prefix: "undefine ",
            punishments: {bans: {}, mutes: {}, warns: {}, kicks: {}, notes: {}},
            lockedChans: [],
            tempRoles: [],
            persistedRoles: [],
            cases: 0,
            modRoles: [],
            adminRoles: [],
            afkMembers: [],
            disabledCommands: [],
            tags: [],
            mutedRole: ""
        });
        return resolve(newDB);
    });
}

async function createEntries(enteryType) {
    return new Promise(resolve => {
        let newDB = new entryDB({
            type: `${enteryType}`,
            entrydb: "a",
            entries: []
        });
        return resolve(newDB);
    });
}

// Get DB Function
// all this function does is just to get the database of the user, sooo...
async function getDB(serverid) {
    return new Promise((resolve, reject) => {
        DB.findOne({
            serverID: serverid
        }, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

async function getEntries(enteryType) {
    return new Promise((resolve, reject) => {
        entryDB.findOne({
            type: enteryType
        }, (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

// Save DB Function
// I don't even know what to tell you, it saves the database, there is nothing else to this function
async function saveDB(savedb) {
    savedb.save().then(console.log(`Successfully saved DataBase`)).catch(err => console.error(err));
}

// Get Time Function
async function getTime(s) {
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

async function setTime(time) {
    let times = ['s', 'm', 'h', 'd'];
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
            let timeMs = time.slice(0,-1);
            let timeMsAdd = timeMs*timeInd;
            let timeMS = Date.now()+timeMsAdd;
            return resolve(timeMS);
        }
    });
}

async function getPages(fullArr, pageNum) {
    let multiNum = Math.ceil(pageNum)-1;
    let startNum = multiNum*5;
    let pages = Math.floor(fullArr.length/5) >= multiNum ? fullArr.slice(startNum,startNum+5) : fullArr.slice(0,5);
    await pages;
    let pagesAmount = Math.ceil(fullArr.length/5);
    let pagesObj = {pages: pages, amount: `${pageNum}/${pagesAmount}`};
    return pagesObj;
}

async function setCleanTitle(message, embed, title) {
    if (!message.content.toLowerCase().endsWith(` -c`) && !message.content.toLowerCase().endsWith(` -clean`)) embed.setTitle(title);
}

async function setCleanFooter(message, embed, footer) {
    if (!message.content.toLowerCase().endsWith(` -c`) && !message.content.toLowerCase().endsWith(` -clean`)) embed.setFooter(footer);
}

module.exports = { getUser, createDB, createEntries, getDB, getEntries, saveDB, getTime, setTime, getPages, setCleanTitle, setCleanFooter }