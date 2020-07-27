const { Utils } = require("./functions/functions");
const { Expire } = require('./functions/expire.js');

module.exports = {
    expire(client) {
        var { getEntries, saveDB } = new Utils(client);
        expire = new Expire(client);
        setInterval(() => {
            getEntries("ban").then(res => {
                if (!res) return;
                let entries = res.entries;
                for (let entry of entries) {
                    if (entry.time < Date.now()+60000) {
                        setTimeout(() => {
                            expire.unban(entry);
                            let index = res.entries.indexOf(entry);
                            res.entries.splice(index,1);
                            saveDB(res);
                        },entry.time-Date.now());
                    }
                }
            });
            getEntries("mute").then(res => {
                if (!res) return;
                let entries = res.entries;
                for (let entry of entries) {
                    if (entry.time < Date.now()+60000) {
                        setTimeout(() => {
                            expire.unmute(entry);
                            let index = res.entries.indexOf(entry);
                            res.entries.splice(index,1);
                            saveDB(res);
                        },entry.time-Date.now());
                    }
                }
            });
            getEntries("lock").then(res => {
                if (!res) return;
                let entries = res.entries;
                for (let entry of entries) {
                    if (entry.time < Date.now()+60000) {
                        setTimeout(() => {
                            expire.unlock(entry);
                            let index = res.entries.indexOf(entry);
                            res.entries.splice(index,1);
                            saveDB(res);
                        },entry.time-Date.now());
                    }
                }
            });
            getEntries("tempRoles").then(res => {
                if (!res) return;
                let entries = res.entries;
                for (let entry of entries) {
                    if (entry.time < Date.now()+60000) {
                        setTimeout(() => {
                            expire.untempRole(entry);
                            let index = res.entries.indexOf(entry);
                            res.entries.splice(index,1);
                            saveDB(res);
                        },entry.time-Date.now());
                    }
                }
            });
        },60000);
    }
}