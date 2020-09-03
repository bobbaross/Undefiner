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
            var user = results.find(usrr => usrr !== null);
        } else {
            if (invite) {let userr = await client.shard.broadcastEval(`this.functions.getUser("${invite.guild.ownerID}")`); var user = userr.find(usrr => usrr !== null);}
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
            .addField(`Owner`, `${user.tag ?? `Owner not found... However... ID: ${user.id}`}`, true)
            .addField(`Moderator`, `${message.author.tag}`, true)
            .addField(`Reason`, `${reason}`)
            client.functions.sendMessageToSupportServerChannel("724615821669957673", embed).catch(err => err);
            client.shard.broadcastEval(`this.guilds.cache.map(guild => guild).filter(guild => guild.ownerID === ${user.id})`).then(guildsFound => {
                var guildsOwnedByOwner = [];
                for (let guildsInIt of guildsFound) {
                    for (let guild of guildsInIt) {
                        guildsOwnedByOwner.push(guild);
                    }
                }
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