const mongoose = require('mongoose');

// don't question it
const Schema = new mongoose.Schema({
    serverID: String,
    db: String,
    prefix: String,
    modCases: [Object],
    lockedChans: [Object],
    tempRoles: [Object],
    persistedRoles: [Object],
    cases: Number,
    modRoles: [String],
    adminRoles: [String],
    afkMembers: [Object],
    disabledCommands: [String],
    tags: [Object],
    settings: {mutedRole: String, modLogs: String, withReason: Boolean, deleteModCommands: Boolean, dmOnPunish: Boolean},
    notes: [Object],
    webhooks: {
        logs: String
    },
    language: String,
    antiUntypable: Boolean,
    disabledUsers: Array,
    disabledChannels: Array,
    autoResponses: [Object],
    comp: {active: Boolean, ending: Number, prize: String, competers: [Object], disabledChans: Array, finishChannel: String, disabledChansInvert: Boolean, blockedRoles: Array}
});

const serverID = mongoose.model("serverID", Schema);
const DB = mongoose.model("db", Schema);

module.exports = { serverID, DB }