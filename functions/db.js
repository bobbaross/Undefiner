const mongoose = require('mongoose');

// don't question it
const Schema = new mongoose.Schema({
    serverID: String,
    db: String,
    prefix: String,
    modCases: [{type: String, case: Number, userId: String, userTag: String, modId: String, modTag: String, reason: String, embedId: String, happenedAt: Number}],
    lockedChans: [Object],
    tempRoles: [Object],
    persistedRoles: [Object],
    cases: Number,
    modRoles: [String],
    adminRoles: [String],
    afkMembers: [Object],
    disabledCommands: [String],
    tags: Object,
    settings: {mutedRole: String, modLogs: String, withReason: Boolean, deleteModCommands: Boolean, dmOnPunish: Boolean},
    notes: [Object]
});

const serverID = mongoose.model("serverID", Schema);
const DB = mongoose.model("db", Schema);

module.exports = { serverID, DB }