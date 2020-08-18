const sanitizer = require('@aero/sanitizer');
module.exports = (client, member) => {
    function sanitize() {
        client.functions.getDB(member.guild.id).then(res => {
            if (res?.antiUntypable !== true) return;
            var sanitized = sanitizer(member.displayName);
            if (member.displayName !== sanitized) {
                if (sanitized.length > 32) sanitized = sanitized.slice(0,30);
                member.setNickname(sanitized).catch(err => err);
            }
        });
    }
    sanitize();
}