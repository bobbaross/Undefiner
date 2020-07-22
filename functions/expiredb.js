const mongoose = require('mongoose');

// don't question it
const ExpireSchema = new mongoose.Schema({
    entrytype: String,
    entrydb: String,
    entries: Array
});

const entryType = mongoose.model("entrytype", ExpireSchema);
const entryDB = mongoose.model("entrydb", ExpireSchema);

module.exports = { entryType, entryDB }