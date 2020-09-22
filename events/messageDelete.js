module.exports = (client, message) => {
    async function loseMSGComp() {
        if (message.author.bot) return;
        client.functions.getCompDB(message.guild.id).then(res => {
            if (res.comp?.active !== true) return;
            var competer = res.comp.competers.find(competer => competer.id === message.author.id);
            if (!competer) return;
            var index = res.comp.competers.indexOf(competer);
            competer.count-=1;
            res.comp.competers.splice(index,1,competer);
            client.functions.saveDB(res);
        });
    }
    loseMSGComp();
}