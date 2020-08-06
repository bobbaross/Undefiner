const { Checks } = require("../functions/checks");

module.exports = (client, oldMember, newMember) => {
    function updateOurTeam() {
        if (newMember.guild.id !== "724602779053719693") return;
        var channel = newMember.guild.channels.cache.get("724612797597745222");
        if (!channel) return;
        var msg = channel.messages.cache.get("724612797597745222");
        if (!msg) return;
        var staffRoles = ["724603074651619401", "724603212598083626", "724609349871206432"];
        function updateTheEmbed(message) {
            let embed = new Discord.MessageEmbed();
            embed.setColor("#fff5c0");
            embed.setTitle("Our Team");
            var developers = [];
            let devRoles = message.guild.members.cache.map(member => member).filter(mem => mem.roles.cache.has('724603074651619401'));
            devRoles.forEach(dev => {
                developers.push(dev.user.tag);
            });
            var admins = [];
            let adminRoles = message.guild.members.cache.map(member => member).filter(mem => mem.roles.cache.has('724603212598083626'));
            adminRoles.forEach(admin => {
                admins.push(admin.user.tag);
            });
            var mods = [];
            let modRoles = message.guild.members.cache.map(member => member).filter(mem => mem.roles.cache.has('724609349871206432'));
            modRoles.forEach(mod => {
                mods.push(mod.user.tag);
            });
            embed.addField(`Founder`, `Aprixia#1033`);
            embed.addField(`Developers`, `${developers.join('\n')}`, true);
            embed.addField(`Administrators`, `${admins.join('\n')}`, true);
            embed.addField(`Moderators`, `${mods.join('\n')}`, true);
            message.edit(embed);
        }
        if (Checks.memberHigherThan(newMember, oldMember)) {
            if (Checks.hasRole(newMember, staffRoles)) {
                updateTheEmbed(msg);
            }
        } else if (Checks.memberHigherThan(oldMember, newMember)) {
            if (Checks.hasRole(newMember, staffRoles)) {
                updateTheEmbed(msg);
            }
        } else return;
    }
    updateOurTeam();
}