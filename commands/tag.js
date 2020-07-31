const {MessageEmbed} = require('discord.js');
const { Utils } = require('../functions/functions.js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "tag",
    aliases: ["tags"],
    description: "Create, delete, modify, or display a tag.",
    category: "information",
    usage: "create <name> <text> | delete <name> | modify <name> <value | color> <value> | display <name> | list",
    guildOnly: true,

    async undefine(client, message, args) {
        utils = new Utils(client);
        utils.getDB(message.guild.id).then(async res => {
            let bypassRoles = [];
            for (let role of res.modRoles) {
                bypassRoles.push(role);
            }
            for (let role of res.adminRoles) {
                bypassRoles.push(role);
            }
            if (!message.member.hasPermission("MANAGE_MESSAGES") && !message.member.roles.cache.some(r => bypassRoles.includes(r.id))) {
                let embed = new MessageEmbed()
                .setDescription(`I may be blind, but I don't see ${message.member.hasPermission("MANAGE_MESSAGES") ? "Whoops" : "Manage Messages"} amongst your permissions.`);
                return message.channel.send(embed).catch(err => err);
            }
            var doing = args.shift();
            if (!doing) {
                let embed = new MessageEmbed()
                .setDescription(`I may overlook this, but I don't think you told me what you wanted to do.\n${this.name} ${this.usage}`);
                return message.channel.send(embed).catch(err => err);
            }
            let name;
            let value;
            let oldValue;
            let embed;
            let resTag;
            let index;
            switch(doing.toLowerCase()) {
                case "create":
                    name = args.shift();
                    if (!name) {
                        embed = new MessageEmbed()
                        .setDescription(`:clap: give :clap: me :clap: a :clap: name :clap:\n${this.name} ${this.usage}`);
                        return message.channel.send(embed).catch(err => err);
                    }
                    if (client.commands.get(name.toLowerCase())) {
                        embed = new MessageEmbed()
                        .setDescription(`Mate, I am not gonna let you create that tag.\n${this.name} ${this.usage}`);
                        return message.channel.send(embed).catch(err => err);
                    }
                    resTag = res.tags.find(tag => tag.name === name.toLowerCase());
                    if (resTag) {
                        embed = new MessageEmbed()
                        .setDescription(`But... This tag already exist! I am not create another tag of one that already exist!\n${this.name} ${this.usage}`);
                        return message.channel.send(embed).catch(err => err);
                    }
                    value = args.join(' ');
                    if (!value) {
                        embed = new MessageEmbed()
                        .setDescription(`Hey, mind telling me what the tag is gonna say?\n${this.name} ${this.usage}`);
                        return message.channel.send(embed).catch(err => err);
                    }
                    res.tags.push({
                        name: name.toLowerCase(),
                        value: value,
                        color: branding
                    });

                    utils.saveDB(res).catch(err => console.error(err));

                    embed = new MessageEmbed()
                    .setColor(branding)
                    .setTitle(`Tags | ${name}`)
                    .setDescription(`Successfully created the tag with name ${name} and value:\n${value}`)

                    message.channel.send(embed);
                    break;
                case "delete":
                    name = args.shift();
                    if (!name) {
                        embed = new MessageEmbed()
                        .setDescription(`:clap: give :clap: me :clap: a :clap: name :clap:\n${this.name} ${this.usage}`);
                        return message.channel.send(embed).catch(err => err);
                    }
                    resTag = res.tags.find(tag => tag.name === name.toLowerCase());
                    if (!resTag) {
                        embed = new MessageEmbed()
                        .setDescription(`But... This tag doesn't exist!\n${this.name} ${this.usage}`);
                        return message.channel.send(embed).catch(err => err);
                    }
                    value = resTag.value;
                    index = res.tags.indexOf(resTag);
                    res.tags.splice(index,1);
                    utils.saveDB(res).catch(err => console.error(err));
                    embed = new MessageEmbed()
                    .setColor(branding)
                    .setTitle(`Tags | ${name}`)
                    .setDescription(`Successfully deleted the tag with name ${name} and value:\n${value}`)

                    message.channel.send(embed);
                    break;
                case "modify":
                    name = args.shift();
                    if (!name) {
                        embed = new MessageEmbed()
                        .setDescription(`:clap: give :clap: me :clap: a :clap: name :clap:\n${this.name} ${this.usage}`);
                        return message.channel.send(embed).catch(err => err);
                    }
                    resTag = res.tags.find(tag => tag.name === name.toLowerCase());
                    if (!resTag) {
                        embed = new MessageEmbed()
                        .setDescription(`But... This tag doesn't exist!\n${this.name} ${this.usage}`);
                        return message.channel.send(embed).catch(err => err);
                    }
                    let item = args.shift();
                    if (!item) {
                        embed = new MessageEmbed()
                        .setDescription(`Uhm... Excuse me what are we modifying again?\n${this.name} ${this.usage}`);
                        return message.channel.send(embed).catch(err => err);
                    }
                    switch(item.toLowerCase()) {
                        case "value":
                            oldValue = resTag.value;
                            value = args.join(' ');
                            index = res.tags.indexOf(resTag);
                            resTag.value = value;
                            res.tags.splice(index,1,resTag);
                            utils.saveDB(res).catch(err => console.error(err));
                            embed = new MessageEmbed()
                            .setColor(branding)
                            .setTitle(`Tags | ${name}`)
                            .setDescription(`Successfully modified the tag with name ${name} and value:\n${value}\nFrom\n${oldValue}`)

                            message.channel.send(embed);
                            break;
                        case "color":
                            oldValue = resTag.color;
                            value = args[0];
                            if (value && value.toLowerCase() === "random") value = "RANDOM";
                            index = res.tags.indexOf(resTag);
                            resTag.color = value;
                            res.tags.splice(index,1,resTag);
                            utils.saveDB(res).catch(err => console.error(err))
                            embed = new MessageEmbed()
                            .setColor(branding)
                            .setTitle(`Tags | ${name}`)
                            .setDescription(`Successfully modified the tag with name ${name} and color:\n${value}\nFrom\n${oldValue}`)

                            message.channel.send(embed);
                            break;
                        default:
                            embed = new MessageEmbed()
                            .setDescription(`That isn't a method...\n${this.name} ${this.usage}`);
                            return message.channel.send(embed).catch(err => err);

                    }
                    break;
                case "display":
                    name = args.shift();
                    if (!name) {
                        embed = new MessageEmbed()
                        .setDescription(`:clap: give :clap: me :clap: a :clap: name :clap:\n${this.name} ${this.usage}`);
                        return message.channel.send(embed).catch(err => err);
                    }
                    resTag = res.tags.find(tag => tag.name === name.toLowerCase());
                    if (!resTag) {
                        embed = new MessageEmbed()
                        .setDescription(`But... This tag doesn't exist!\n${this.name} ${this.usage}`);
                        return message.channel.send(embed).catch(err => err);
                    }
                    embed = new MessageEmbed()
                    .setColor(resTag.color)
                    utils.setCleanTitle(message, embed, name)
                    embed.setDescription(`${resTag.value}`)

                    message.channel.send(embed).then(msg => {
                        if (message.mentions.users.first()) msg.edit(`${message.mentions.users.first()}${embed}`);
                    });
                    break;
                case "list":
                    let tags = [];
                    for (let tagInstance of res.tags) {
                        tags.push(tagInstance.name);
                    }
                    embed = new MessageEmbed()
                    .setColor(branding)
                    .setTitle("Tags")
                    .setDescription(`\`${tags.join('` `')}\``)

                    message.channel.send(embed);
                    break;
                default:
                    embed = new MessageEmbed()
                    .setDescription(`Hey! This isn't a method!\n${this.name} ${this.usage}`)
                    return message.channel.send(embed);
            }
        });
    }
}