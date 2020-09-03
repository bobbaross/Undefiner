const message = require("./message");

module.exports = (client, guild) => {
    async function isBanned() {
        client.functions.getStaffDB().then(async res => {
            if (!res) res = await client.functions.createStaffDB();
            let sysChan = guild.systemChannel;
            if (res.bannedServers.find(item => item === guild.id)) {
                let item = res.bannedServers.find(item => item === guild.id);
                try {
                    if (sysChan.permissionOverwrites.get(client.user.id).allow.has("SEND_MESSAGES")) {
                        sysChan.send(`Hey! This server is banned from using this bot.\n**Reason**: ${item.reason}\n\nThink this is a mistake? Join https://discord.gg/k2PEWMw and go to the support channel and we help you out!`);
                    }
                } catch (error) {return}
                finally {guild.leave()}
            }
            else if (res.bannedOwners.find(item => item === guild.ownerID)) {
                let item = res.bannedOwners.find(item => item === guild.ownerID);
                try {
                    if (sysChan.permissionOverwrites.get(client.user.id).allow.has("SEND_MESSAGES")) {
                        sysChan.send(`Hey! The owner of this server is banned from using this bot.\n**Reason**: ${item.reason}\n\nThink this is a mistake? Join https://discord.gg/k2PEWMw and go to the support channel and we help you out!`);
                    }
                } catch (error) {return}
                finally {guild.leave()}
            }
        });
    }
    isBanned();
}