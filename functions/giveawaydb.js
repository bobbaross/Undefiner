const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema({
    giveawayServer: String,
    activeGiveaways: Array,
    winners: Array
});

const giveawayServer = mongoose.model("serverID", giveawaySchema);
const giveaways = mongoose.model("db", giveawaySchema);

module.exports = { giveawayServer, giveaways }