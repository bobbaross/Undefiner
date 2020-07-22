const mongoose = require('mongoose');

// don't question it
const Schema = new mongoose.Schema({
    type: String,
    db: String,
    entries: Array
});

const entryType = mongoose.model("type", Schema);
const entryDB = mongoose.model("db", Schema);

module.exports = { name: "db", entryType, entryDB }