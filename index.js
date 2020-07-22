const {webhookSecret} = require('./config.json');
const app = require('express')();
const crypto = require('crypto');
const exec = require('child_process').exec;
const port = 9094;
app.post("*", (req, res) => {
    req.on("data", async function (chunk) {
            await handle(res, req.headers["x-hub-signature"], webhookSecret, chunk)
        return;
    })
}).listen(port);
app.get("*", () => {
    return;
})
const shard = require('./shard.js');
async function handle(res, header, conf, chunk) {
    let sig = "sha1=" + crypto.createHmac('sha1', conf).update(chunk.toString()).digest('hex');
    if (header === sig) {
        await exec(`git fetch --all && git reset --hard origin/master && pm2 restart Undefiner`,
            (err, out) => {
                console.log(out)
            });
        res.sendStatus(200)
    } else {
        res.sendStatus(403)
    }
}
try {
    shard();
} catch (error) {
    console.error(error);
}