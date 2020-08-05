module.exports = {
    name: "test",
    description: "test",
    category: "developer",
    aliases: [],
    usage: "",

    undefine(client, message, args) {
        let embed = new Discord.MessageEmbed();
    embed.setColor("#fff5c0")
    embed.setTitle("Our Team")
    var developers = [];
    let devRoles = new Promise(resolve => {message.guild.members.fetch({cache: false}).then(ms => {resolve(ms.map(member => member).filter(mem => mem.roles.cache.has('724603074651619401')))})});
    devRoles.forEach(dev => {
        developers.push(dev.tag);
    });
    embed.addField(`Founder`, `Aprixia#1033`);
    embed.addField(`Developers`, `a\n${developers.join('\n')}`);
    console.log(embed)
    message.channel.send(embed);
    
    }
}