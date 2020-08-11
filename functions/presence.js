module.exports = (client) => {
    client.shard.fetchClientValues('guilds.cache.size').then(results => {
        client.user.setPresence({ activity: { name: `${results.reduce((prev, guildCount) => prev + guildCount, 0)} undefined servers`}, ststus: "online"});
        setInterval(() => {
            client.user.setPresence({ activity: { name: `${results.reduce((prev, guildCount) => prev + guildCount, 0)} undefined servers`}, ststus: "online"});
        }, 600000);
        setTimeout(() => {
            setInterval(() => {
                client.user.setPresence({ activity: { name: `undefined servers`}, ststus: "online"});
            }, 600000);    
        }, 300000);
    });
}