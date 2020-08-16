const {MessageEmbed} = require('discord.js');
const weather = require('weather-js');
const {branding} = require('../config.json').colors;

module.exports = {
    name: "weather",
    description: "Get weather information in a certain area.",
    usage: "<C/F> <city name>",
    aliases: [],
    category: "miscellaneous",

    async undefine(client, message, args) {
        var degreeType = args[0];
        if (!degreeType) {
            let embed = new MessageEmbed()
            .setDescription(`Hey, I need to know whether you'd like Celsius or Fahrenheit!\n${this.name} ${this.usage}`)
            return message.channel.send(embed).catch(err => message.channel.send(embed.description));
        }
        await args.shift();
        var city = args.join(' ');
        if (!city) {
            let embed = new MessageEmbed()
            .setDescription(`Excuse me, which city again? **I promise I am not a creep...**!\n${this.name} ${this.usage}`)
            return message.channel.send(embed).catch(err => message.channel.send(embed.description));
        }
        weather.find({ search: city, degreeType, degreeType}, (err,result) => {
            if (err) return;
            if (!result[0]) {
                let embed = new MessageEmbed()
                .setDescription(`REEEEEEEEE I CAN'T FIND ANY RESULTS!!!`)
                return message.channel.send(embed).catch(err => message.channel.send(embed.description));
            }
            var current = result[0].current;
            var location = result[0].location;

            const embed = new MessageEmbed()
            .setDescription(`**${current.skytext}**`)
            .setTitle(`Weather for ${current.observationpoint}`)
            .setThumbnail(current.imageUrl)
            .setColor(branding)
            .addField('Timezone', `UTC${location.timezone}`, true)
            .addField('Degree type', location.degreetype, true)
            .addField('Temperature', `${current.temperature} degrees`, true)
            .addField('Feels like', `${current.feelslike} degrees`, true)
            .addField('Winds', current.winddisplay, true)
            .addField('Humidity', `${current.humidity}%`, true)

            return message.channel.send(embed).catch(err => {
                let fields = [];
                for (i=0;i<embed.fields.length;i++) {
                    fields.push(`**${embed.fields[i].name}**: ${embed.fields[i].value}`);
                }
                message.channel.send(`${embed.title}
${embed.description}
${fields.join('\n\n')}`).catch(err => err);
            });
        });
    }
}