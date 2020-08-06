const { Checks } = require("../functions/checks");
const {MessageEmbed} = require("discord.js");

module.exports = (client, oldMember, newMember) => {
    function updateOurTeam() {
        console.log('a')
        if (newMember.guild.id !== "724602779053719693") return;
        console.log('b')
        var channel = newMember.guild.channels.cache.get("724612797597745222");
        console.log('c')
        if (!channel) return;
        console.log('d')
        channel.messages.fetch("724612797597745222").then(msg => {;
            console.log('e')
            if (!msg) return;
            console.log('f')
            var staffRoles = ["724603074651619401", "724603212598083626", "724609349871206432"];
            console.log('g')
            function updateTheEmbed(message) {
                console.log('h')
                let embed = new MessageEmbed();
                console.log('q')
                embed.setColor("#fff5c0");
                console.log('w')
                embed.setTitle("Our Team");
                console.log('r')
                var developers = [];
                console.log('t')
                let devRoles = message.guild.members.cache.map(member => member).filter(mem => mem.roles.cache.has('724603074651619401'));
                console.log('y')
                devRoles.forEach(dev => {
                    console.log('u')
                    developers.push(dev.user.tag);
                });
                console.log('i')
                if (devRoles === 0) devRoles.push("None");
                console.log('o')
                var admins = [];
                let adminRoles = message.guild.members.cache.map(member => member).filter(mem => mem.roles.cache.has('724603212598083626'));
                adminRoles.forEach(admin => {
                    admins.push(admin.user.tag);
                });
                if (adminRoles === 0) adminRoles.push("None");
                var mods = [];
                let modRoles = message.guild.members.cache.map(member => member).filter(mem => mem.roles.cache.has('724609349871206432'));
                modRoles.forEach(mod => {
                    mods.push(mod.user.tag);
                });
                if (modRoles === 0) modRoles.push("None");
                embed.addField(`Founder`, `Aprixia#1033`);
                embed.addField(`Developers`, `${developers.join('\n')}`, true);
                embed.addField(`Administrators`, `${admins.join('\n')}`, true);
                embed.addField(`Moderators`, `${mods.join('\n')}`, true);
                console.log('p')
                message.edit(embed);
            }
            if (Checks.memberHigherThan(newMember, oldMember)) {
                console.log('s')
                if (Checks.hasRole(newMember, staffRoles)) {
                    console.log('j')
                    updateTheEmbed(msg);
                }
            } else if (Checks.memberHigherThan(oldMember, newMember)) {
                console.log('k')
                if (Checks.hasRole(newMember, staffRoles)) {
                    console.log('l')
                    updateTheEmbed(msg);
                }
            } else {
                console.log('z')
                return;
            }
        });
    }
    updateOurTeam();
    console.log('x')
}