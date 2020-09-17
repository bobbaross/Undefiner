module.exports = (client, oldChannel, newChannel) => {
    function noMutedCanTalk() {
        client.functions.getDB(newChannel.id).then(res => {
            if (!newChannel.guild.roles.cache.get(res?.settings.mutedRole)) return;
            if (!newChannel.permissionFor(res.settings.mutedRole).has("SEND_MESSAGES")) return;
            newChannel.updateOverwrites(res.settings.mutedRole, {
                SEND_MESSAGES: false
            }).catch(err => err);
        });
    }
    noMutedCanTalk();
}