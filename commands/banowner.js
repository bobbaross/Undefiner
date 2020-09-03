const {MessageEmbed} = require('discord.js');
const {branding, bad} = require ('../config.json').colors;
const uniqid = require('uniqid');

module.exports = {
    name: "banowner",
    description: "Ban a owner from using the bot.",
    usage: "<id or invite or mention> <reason>",
    category: "botstaff",
    staffOnly: true,
    auth: "admin",
    aliases: [],

    async undefine(client, message, args, hasEmbedPerms) {
        var usr = args.shift();
        if (!usr) {
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Mind telling me which owner to ban?`)
            if (hasEmbedPerms === true) {
                return message.channel.send(embed).catch(err => err);
            } else {
                return message.channel.send(embed.description).catch(err => err);
            }
        }
        if (usr.includes('discord.gg')) {
            let results = await client.shard.broadcastEval(`this.fetchInvite("${usr}")`);
            var invite = results.find(invite => invite !== null);
        }
        if (!invite) {
            let results = await client.shard.broadcastEval(`this.functions.getUser("${usr}")`);
            let userr = results.find(usrr => usrr !== null);
            var user = userr[0];
        } else {
            if (invite) {
                let usrid = invite.guild.ownerID;
                let results = await client.shard.broadcastEval(`this.functions.getUser("${usrid}")`);
                let userr = results.find(usrr => usrr !== null);
                var user = userr[0];
            }
        }
        if (!user) {
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`I don't know that owner.`)
            if (hasEmbedPerms === true) {
                return message.channel.send(embed).catch(err => err);
            } else {
                return message.channel.send(embed.description).catch(err => err);
            }
        }
        var reason = args.join(' ');
        if (!reason) {
            let embed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Please give me a reason for this.`)
            if (hasEmbedPerms === true) {
                return message.channel.send(embed).catch(err => err);
            } else {
                return message.channel.send(embed.description).catch(err => err);
            }
        }
        client.functions.getStaffDB().then(async res => {
            if (!res) res = await client.functions.createStaffDB();
            res.infractions.push({
                id: uniqid("ownerBan-(", ")"),
                owner: user.id,
                ownerTag: user.tag,
                mod: message.author.id,
                modTag: message.author.tag,
                reason: reason
            });
            res.bannedOwners.push(user.id);
            res.staffCaseNum++;
            client.functions.saveDB(res).catch(err => err)
            let embed = new MessageEmbed()
            .setColor(bad)
            .setTitle(`Owner Banned | Case #${res.staffCaseNum}`)
            .addField(`Owner`, `${theServer.owner?.tag ?? `Owner not found... However... ID: ${user.id}`}`, true)
            .addField(`Moderator`, `${message.author.tag}`, true)
            .addField(`Reason`, `${reason}`)
            client.functions.sendMessageToSupportServerChannel("648040594651742239", embed).catch(err => err);
            client.broadcastEval(`this.guilds.cache.map(guild => guild).filter(guild => guild.ownerID === ${user.id})`).then(guildsFound => {
                var guildsOwnedByOwner = guildsFound.filter(g => g !== null);
                guildsOwnedByOwner.forEach(aGuild => {
                    if (aGuild.ownerID !== user.id) return console.log(`Guild ${aGuild.name} owned by ${aGuild.ownerID} was found by mistake.`);
                    console.log(`Guild ${aGuild.name} owned by ${aGuild.ownerID} was found to be owned by ${user.id}... Leaving...`);
                    client.functions.leaveServer(aGuild.id).catch(err => err);
                });
            });
            let successEmbed = new MessageEmbed()
            .setColor(branding)
            .setDescription(`Successfully banned the owner!`)
            if (hasEmbedPerms === true) {
                return message.channel.send(successEmbed).catch(err => err);
            } else {
                return message.channel.send(successEmbed.description).catch(err => err);
            }
        });
    }
}