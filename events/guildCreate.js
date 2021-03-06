module.exports = (client, guild) => {
    async function isBanned() {
        client.functions.getStaffDB().then(async res => {
            if (!res) res = await client.functions.createStaffDB();
            let sysChan = guild.systemChannel;
            if (res.bannedServers.find(item => item === guild.id)) {
                let item = res.infractions.find(item => item.server === guild.id);
                try {
                    if (sysChan.permissionsFor(client.user.id).has("SEND_MESSAGES")) {
                        sysChan.send(`Hey! This server is banned from using this bot.\n**Reason**: ${item.reason}\n\nThink this is a mistake? Join https://discord.gg/k2PEWMw and go to the support channel and we help you out!`);
                    }
                } catch (error) {return}
                finally {setTimeout(() => {guild.leave()}, 2500);}
            }
            else if (res.bannedOwners.find(item => item === guild.ownerID)) {
                let item = res.infractions.find(item => item.owner === guild.ownerID);
                try {
                    if (sysChan.permissionsFor(client.user.id).has("SEND_MESSAGES")) {
                        sysChan.send(`Hey! The owner of this server is banned from using this bot.\n**Reason**: ${item.reason}\n\nThink this is a mistake? Join https://discord.gg/k2PEWMw and go to the support channel and we help you out!`);
                    }
                } catch (error) {return}
                finally {setTimeout(() => {guild.leave()}, 2500);}
            }
        });
    }
    isBanned();
}