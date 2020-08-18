module.exports = {
    name: "ping",
    description: "Returns API and latency",
    category: "information",
    usage: "",
    aliases: [],
    
    async undefine(client, message, args, hasEmbedPerms) {
        let msg = await message.channel.send("Pinging... ")
        await msg.edit(`
        🏓 Pong! 🏓
       Ping is \`${client.ws.ping}ms\`
       Latency is \`${msg.createdTimestamp - message.createdTimestamp}ms\`
        `)
    }
}