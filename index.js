const {Database} = require('./database.js');
const {itemFolder, villagerFolder} = require('./config.json');
const itemDatabase = new Database('./items.db', itemFolder);
const villagerDatabase = new Database('./villagers.db', villagerFolder);

const express = require('express');
const bodyparser = require('body-parser');
const app = new express();

const {port} = require('./config.json');

app.use(bodyparser.json());

app.get('/item', function(req, res)
{
    console.log(req.body);
    let state = "failure";
    if(itemDatabase.built)
    {
        itemDatabase.findEntry(req.body)
        .then(item =>
            {
                state = "success";
                res.send({
                    status: state,
                    item: item
                });
            })
        .catch(err =>
            {
                console.log(err);
                state = "failure";
                res.send({status: state});
            });
    }
    else
    {
        res.send({status: state});
    }
});

app.get('/villager', function(req, res)
{
    console.log(req.body);
    let state = "failure";
    if(villagerDatabase.built)
    {
        villagerDatabase.findEntry(req.body)
        .then(villager =>
            {
                state = "success";
                res.send({
                    status: state,
                    villager: villager
                });
            })
        .catch(err =>
            {
                console.log(err);
                state = "failure";
                res.send({status: state});
            });
    }
    else
    {
        res.send({status: state});
    }
});

app.listen(port, console.log("Listening on port " + port));