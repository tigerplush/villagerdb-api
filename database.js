const dataStore = require('nedb');
const fs = require('fs');
const {dataPath} = require('./config.json');
const path = require('path');

class Database
{
    constructor(databaseName, folder)
    {
        this.database = new dataStore(databaseName);
        this.built = false;
        this.folder = folder;
        this.updates = 0;
        this.inserts = 0;

        this.loadDatabase()
        .then(() => {
            this.loadContent()
            .then(entries =>
                {
                    this.addEntries(entries)
                    .then(infos =>
                        {
                            console.log(infos.map(info => info.additions).reduce((acc, cur) => acc + cur, 0) + " additions");
                            console.log(infos.map(info => info.updates).reduce((acc, cur) => acc + cur, 0) + " updates");
                        })
                    .catch(err => console.log(err))
                    .then(() =>
                        {
                            this.getNumberOfEntries()
                            .then(numberOfEntries => console.log("Database contains " + numberOfEntries + " items"))
                            .catch()
                            .finally(this.built = true);
                        });
                })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }

    loadDatabase()
    {
        return new Promise((resolve, reject) =>
        {
            this.database.loadDatabase(function(err)
            {
                if(err)
                {
                    reject(err);
                }
                resolve();
            });
        });
    }

    loadContent()
    {
        return new Promise((resolve, reject) =>
        {
            const contentPath = path.join(dataPath, this.folder);
            const fileNames = fs.readdirSync(contentPath).filter(file => file.endsWith('.json'));
            console.log("Trying to load " + fileNames.length + " items");
    
            const filePromises = fileNames.map(file => path.join(contentPath, file)).map(this.loadEntry);
            Promise.all(filePromises)
            .then(fileBuffers =>
                {
                    resolve(fileBuffers.map(JSON.parse));
                })
            .catch(err => reject(err));
        });
    }

    loadEntry(filename)
    {
        return new Promise((resolve, reject) =>
        {
            fs.readFile(filename, function(err, data)
            {
                if(err)
                {
                    reject(err);
                }
                else
                {
                    resolve(data);
                }
            });
        });
    }

    addEntries(entries)
    {
        return new Promise((resolve, reject) =>
        {
            const entryPromises = entries.map(entry => this.addEntry(entry));

            Promise.all(entryPromises)
            .then(infos =>
                {
                    resolve(infos);
                })
            .catch(err => reject(err));
        });
    }

    addEntry(entry)
    {
        return new Promise((resolve, reject) =>
        {
            this.findEntry({id: entry.id})
            .then(docs =>
                {
                    if(docs && docs.length > 0)
                    {
                        this.database.update
                        (
                            {id: entry.id},
                            entry,
                            {},
                            function(err, numberOfUpdates, upserts)
                            {
                                if(err)
                                {
                                    reject(err);
                                }
                                resolve({updates: numberOfUpdates});
                            }
                        );
                        resolve({updates: 1});
                    }
                    else
                    {
                        this.database.insert(entry, function(err, doc)
                        {
                            if(err)
                            {
                                reject(err);
                            }
                            else
                            {
                                resolve({additions: 1})
                            }
                        });
                    }
                })
            .catch(err => reject(err));
        });
    }

    findEntry(entry)
    {
        return new Promise((resolve, reject) =>
        {
            this.database.find(entry, function(err, docs)
            {
                if(err)
                {
                    reject(err);
                }
                resolve(docs);
            });
        });
    }

    getNumberOfEntries()
    {
        return new Promise((resolve, reject)=>
        {
            this.database.find({}, function(err, docs)
            {
                if(err)
                {
                    reject(err);
                }
                resolve(docs.length);
            });
        });
    }
}

module.exports = {
    Database: Database
};