const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    settingsServer: String,
    prefix: String,
    settings: {mutedRole: String, modLogs: String, withReason: Boolean, deleteModCommands: Boolean, dmOnPunish: Boolean},
    modRoles: Array,
    adminRoles: Array,
    disabledCommands: Array,
    disabledUsers: Array,
    disabledChannels: Array,
    antiUntypable: Boolean,
    autoResponses: [Object]
});

const settingsServer = mongoose.model("settingsServer", settingsSchema);
const settings = mongoose.model("settings", settingsSchema);

module.exports = { settingsServer, settings }