const { Utils } = require("./functions/functions");
const { Expire } = require('./functions/expire.js');

module.exports = {
    expire(client) {
        var { getEntries, saveDB } = new Utils(client);
        var {unmute,unban,unlock,untempRole} = new Expire(client);
        setInterval(() => {
            getEntries("ban").then(res => {
                if (!res) return;
                let entries = res.entries;
                for (let entry of entries) {
                    if (entry.time < Date.now()+60000) {
                        setTimeout(() => {
                            unban(entry);
                            let index = res.entries.findIndex(entry);
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
                            unmute(entry);
                            let index = res.entries.findIndex(entry);
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
                            unlock(entry);
                            let index = res.entries.findIndex(entry);
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
                            untempRole(entry);
                            let index = res.entries.findIndex(entry);
                            res.entries.splice(index,1);
                            saveDB(res);
                        },entry.time-Date.now());
                    }
                }
            });
        },60000);
    }
}