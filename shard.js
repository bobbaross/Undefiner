module.exports = () => {
    const { token } = require(`./config.json`);
    const { ShardingManager } = require('discord.js');
    const manager = new ShardingManager('./bot.js', { totalShards: 'auto', token: token });

    manager.spawn().then(() => manager.broadcast("All Shards Ready"));
    manager.on('shardCreate', shard => {
        console.log(`Launched shard ${shard.id}`);
    });
}