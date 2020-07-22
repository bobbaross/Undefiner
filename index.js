const {webhookSecret} = require('./config.json');
const http = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;

http.createServer(function (req, res) {
    req.on('data', async function (chunk) {
        let sig = "sha1=" + crypto.createHmac('sha1', webhookSecret).update(chunk.toString()).digest('hex');

        if (req.headers['x-hub-signature'] == sig) {
            await exec('git pull');
            process.exit();
        }
    });

    res.end();
}).listen(9004);

const shard = require('./shard.js');

try {
    shard();
} catch (error) {
    console.error(error);
}