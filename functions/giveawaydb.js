const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema({
    giveawayServer: String,
    activeGiveaways: Array,
    winners: Array
});

const giveawayServer = mongoose.model("giveawayServer", giveawaySchema);
const giveaways = mongoose.model("activeGiveaways", giveawaySchema);

module.exports = { giveawayServer, giveaways }