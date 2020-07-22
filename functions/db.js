const mongoose = require('mongoose');

// don't question it
const Schema = new mongoose.Schema({
    serverID: String,
    db: String,
    prefix: String,
    punishments: {bans: Object, mutes: Object, warns: Object, kicks: Object, notes: Object},
    lockedChans: [Object],
    tempRoles: [Object],
    persistedRoles: [Object],
    cases: Number,
    modRoles: [String],
    adminRoles: [String],
    afkMembers: [Object],
    disabledCommands: [String],
    tags: [Object],
    settings: {mutedRole: String, modLogs: String}
});

const serverID = mongoose.model("serverID", Schema);
const DB = mongoose.model("db", Schema);

module.exports = { name: "db", serverID, DB }