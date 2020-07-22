const { token } = require(`./config.json`);
const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { totalShards: 'auto', token: token });

manager.spawn();
manager.on('shardCreate', shard => {
    console.log(`Launched shard ${shard.id}`);
});