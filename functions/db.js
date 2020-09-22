const mongoose = require('mongoose');

// don't question it
const Schema = new mongoose.Schema({
    serverID: String,
    db: String,
    tempRoles: [Object],
    persistedRoles: [Object],
    afkMembers: [Object],
    tags: [Object],
    language: String,
});

const serverID = mongoose.model("serverID", Schema);
const DB = mongoose.model("db", Schema);

module.exports = { serverID, DB }