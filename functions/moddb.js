const mongoose = require('mongoose');

const modSchema = new mongoose.Schema({
    modServer: String,
    modCases: [Object],
    lockedChans: [Object],
    cases: Number,
    notes: [Object]
});

const modServer = mongoose.model("modServer", modSchema);
const modCases = mongoose.model("modCases", modSchema);

module.exports = { modServer, modCases }