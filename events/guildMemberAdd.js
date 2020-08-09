const sanitizer = require('@aero/sanitizer');
const { Utils } = require('../functions/functions');

module.exports = (client, member) => {
    utils = new Utils(client);
    function sanitize() {
        utils.getDB(member.guild.id).then(res => {
            if (res?.antiUntypable !== true) return;
            var sanitized = sanitizer(newMember.displayName);
            if (member.displayName !== sanitized) member.setNickname(sanitized).catch(err => err);
        });
    }
    sanitize();
}