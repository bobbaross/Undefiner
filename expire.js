const { getEntries, saveDB } = require('./functions/functions.js');
const {unmute,unban,unlock,untempRole} = require('./functions/expire.js');

module.exports = {
    expire(client) {
        setInterval(() => {
            getEntries("ban").then(res => {
                let entries = res.entries;
                for (let entry of entries) {
                    if (entry.time < Date.now()+60000) {
                        setTimeout(() => {
                            unban(entry, client);
                            let index = res.entries.findIndex(entry);
                            res.entries.splice(index,1);
                            saveDB(res);
                        },entry.time-Date.now());
                    }
                }
            });
            getEntries("mute").then(res => {
                let entries = res.entries;
                for (let entry of entries) {
                    if (entry.time < Date.now()+60000) {
                        setTimeout(() => {
                            unmute(entry, client);
                            let index = res.entries.findIndex(entry);
                            res.entries.splice(index,1);
                            saveDB(res);
                        },entry.time-Date.now());
                    }
                }
            });
            getEntries("lock").then(res => {
                let entries = res.entries;
                for (let entry of entries) {
                    if (entry.time < Date.now()+60000) {
                        setTimeout(() => {
                            unlock(entry, client);
                            let index = res.entries.findIndex(entry);
                            res.entries.splice(index,1);
                            saveDB(res);
                        },entry.time-Date.now());
                    }
                }
            });
            getEntries("tempRoles").then(res => {
                let entries = res.entries;
                for (let entry of entries) {
                    if (entry.time < Date.now()+60000) {
                        setTimeout(() => {
                            untempRole(entry, client);
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