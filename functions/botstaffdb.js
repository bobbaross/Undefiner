const mongoose = require('mongoose');

// don't question it
const botstaffActions = new mongoose.Schema({
    botstaffdb: String,
    global: Boolean,
    bannedServers: Array,
    bannedUsers: Array,
    bannedOwners: Array,
    bannedAdmins: Array,
    infractions: [Object],
    StaffCaseAmount: Number
});

const global = mongoose.model("global", botstaffActions);
const botstaffdb = mongoose.model("botstaffdb", botstaffActions);

module.exports = { global, botstaffdb }