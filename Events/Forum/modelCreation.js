const { Events } = require('discord.js');
const fs = require(`fs`);
const Extractor = require('../../Misc/extractor.js')
const modelsFile = require('../../JSON/_models.json')
const rll = require('read-last-lines');

module.exports = {
    name: Events.ThreadCreate,
    run(client, thread, newlyCreated) {
        const { models } = require('../../JSON/channels.json');
        if(newlyCreated && (models.id == thread.parentId))
            updateModels(thread)
    },
}

async function updateModels(thread) {
    let result;
    let starterMessage = await thread.fetchStarterMessage().catch(err => {
        console.log(`unsuccessfully fetched starter message`)
    })

    if (Extractor.extractDownloadLinks(starterMessage?.content)?.length) {
        let user = starterMessage?.author;
        
        result = {
            id: modelsFile[modelsFile.length-1].id + 1,
            title: thread.name,
            starterMessage: starterMessage?.content,
            creator: user?.username,
            creatorID: user?.id,
            creationTimestamp: thread.createdTimestamp,
            downloadURL: Extractor.extractDownloadLinks(starterMessage?.content),
            illustrationURL: Extractor.extractAttachmentLinks(starterMessage),
            tags: Extractor.snowflakeToName(thread.appliedTags)
        };
    }
    filename = `${process.cwd()}/JSON/_models.json`;
    rll.read(filename, 2).then(async (lines) => {
        var to_vanquish = lines.length;
        fs.stat(filename, async (err, stats) => {
            if (err) throw err;
            fs.truncateSync(filename, stats.size - to_vanquish, (err) => {
                if (err) throw err;
                console.log('File truncated!');
            })
            fs.appendFileSync(filename, '\t},\n\t'+JSON.stringify(result, null, 4) + '\n]');
        });
    }); 
}