const { Checks } = require("../functions/checks");
const {MessageEmbed} = require("discord.js");
const sanitizer = require('@aero/sanitizer');
const { Utils } = require("../functions/functions");

module.exports = (client, oldMember, newMember) => {
    utils = new Utils(client);
    function updateOurTeam() {
        if (newMember.guild.id !== "724602779053719693") return;
        var channel = newMember.guild.channels.cache.get("724612797597745222");
        if (!channel) return;
        channel.messages.fetch("740610386432360529").then(msg => {
            if (!msg) return;
            var staffRoles = ["724603074651619401", "724603212598083626", "724609349871206432"];
            function updateTheEmbed(message) {
                let embed = new MessageEmbed();
                embed.setColor("#fff5c0");
                embed.setTitle("Our Team");
                var developers = [];
                let devRoles = message.guild.members.cache.map(member => member).filter(mem => mem.roles.cache.has('724603074651619401'));
                devRoles.forEach(dev => {
                    developers.push(dev.user.tag);
                });
                if (developers.length === 0) developers.push("None");
                var admins = [];
                let adminRoles = message.guild.members.cache.map(member => member).filter(mem => mem.roles.cache.has('724603212598083626'));
                adminRoles.forEach(admin => {
                    admins.push(admin.user.tag);
                });
                if (admins.length === 0) admins.push("None");
                var mods = [];
                let modRoles = message.guild.members.cache.map(member => member).filter(mem => mem.roles.cache.has('724609349871206432'));
                modRoles.forEach(mod => {
                    mods.push(mod.user.tag);
                });
                if (mods.length === 0) mods.push("None");
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
                if (Checks.hasRole(oldMember, staffRoles)) {
                    updateTheEmbed(msg);
                }
            } else return;
        });
    }
    function sanitize() {
        utils.getDB(newMember.guild.id).then(res => {
            if (res?.antiUntypable !== true) return;
            var sanitized = sanitizer(newMember.displayName);
            if (newMember.displayName !== sanitized) newMember.setNickname(sanitized);
        });
    }
    updateOurTeam();
    sanitize();
}