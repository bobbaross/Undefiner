const mongoose = require('mongoose');

// don't question it
const ExpireSchema = new mongoose.Schema({
    type: String,
    db: String,
    entries: Array
});

const entryType = mongoose.model("type", ExpireSchema);
const entryDB = mongoose.model("db", ExpireSchema);

module.exports = { name: "db", entryType, entryDB }