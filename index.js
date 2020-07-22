const express = require('express');
const app = express();
const gad = require('git-auto-deploy');

app.listen(9004, () => console.log(`Webhook Running!`));

app.post('/aprixia/undefiner/webhook', (req,res) => {
    if (req.headers.secret === webhookSecret) {
        res.sendStatus(200);
        gad.deploy();
    }
});

const shard = require('./shard.js');

try {
    shard();
} catch (error) {
    console.error(error);
}