const mongoose = require('mongoose');

const compSchema = mongoose.Schema({
    compServer: String,
    comp: {active: Boolean, ending: Number, prize: String, competers: [Object], disabledChans: Array, finishChannel: String, disabledChansInvert: Boolean, blockedRoles: Array}
});

const compServer = mongoose.model("compServer", compSchema);
const comp = mongoose.model("comp", compSchema);

module.exports = { compServer, comp }