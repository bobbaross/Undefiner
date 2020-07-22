const mongoose = require('mongoose');

// don't question it
const ExpireSchema = new mongoose.Schema({
    type: String,
    entrydb: String,
    entries: Array
});

const entryType = mongoose.model("type", ExpireSchema);
const entryDB = mongoose.model("entrydb", ExpireSchema);

module.exports = { entryType, entryDB }