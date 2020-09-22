const mongoose = require('mongoose');

const webhooksSchema = new mongoose.Schema({
    webhooksServer: String,
    webhooks: Array
});

const webhooksServer = mongoose.model("webhooksServer", webhooksSchema);
const webhooks = mongoose.model("webhooks", webhooksSchema);

module.exports = { webhooksServer, webhooks }