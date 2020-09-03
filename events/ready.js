module.exports = (client) => {
    console.log(`Running!`);
    async function isBanned() {
        client.functions.getStaffDB().then(async res => {
            if (!res) res = await client.functions.createStaffDB();
            for (let id of res.bannedServers) {
                if (client.guilds.cache.get(id)) client.guilds.cache.get(id).leave();
            }
            for (let id of res.bannedOwners) {
                if (client.guilds.cache.find(guild => guild.ownerID === id)) client.guilds.cache.find(guild => guild.ownerID = id).leave();
            }
        });
    }
    isBanned();
}