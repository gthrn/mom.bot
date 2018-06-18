let request = require('request');
let Message = require('../api/models/message');
let BotMessage = require('../api/models/botMessage');
let database = require('../mysql');
let moment = require('moment');
let self = null;

function initialize() {
    return new Promise(function (resolve, reject) {
        if (self instanceof BotMessage) resolve(self);

        database.selectModuleByFilePath('./modules/googleSearch').then(
            function (res) {
                self = res[0];
                resolve(res); }
            ,
            function (err) {
                reject(err);
            }
        );
    });
}

/**
 * Tries to process a message.
 * If the message fits one of the regex's , triggers GoogleSearchApi and searches for searchterm then returns the results
 * @param message
 * @returns {Promise<BotMessage>}
 */
function process(message) {
    return new Promise(function(resolve, reject) {
        if (!message instanceof Message) {
            reject(new Error('Wrong class given'));
        }

        let keyWordRegex = new RegExp('^('+self.groupKeyWord+'\\s'+self.keyWord+'|'+self.keyWord+'|'+self.groupKeyWord+'(?!\\snews))\\s(.*)$', 'mi');
        let regex = /Was (ist|sind)\s(.*)?/mi;

        let matches = null;
        switch(true){
            case (matches = message.content.match(keyWordRegex)) != null:
                try {
                    search(matches[2]).then(function(res, err) {
                        if (err) reject(err);
                        resolve(res)
                    });
                } catch (err) {
                    reject(err);
                }
                break;
            case (matches = message.content.match(regex)) != null:
                try {
                    search(matches[2]).then(function(res, err) {
                        if (err) reject(err);
                        resolve(res)
                    });
                } catch (err) {
                    reject(err);
                }
                break;
            default:
                reject('Not searching')
        }
    })
}

function search(search) {
    return new Promise(function(resolve, reject) {


        let apiKey = self.apiKey; // API Key aus der Datenbank
        let apiEngine = "002976359839243672003:j4hc5ddl2au"; // Engine searching the entire web.

        let url = "https://www.googleapis.com/customsearch/v1?key="+apiKey+"&cx="+apiEngine+"&q="+encodeURIComponent(search)+"&start=1&num=3";
        console.log(url);
        request.get({
            url: url,
            json: true,
            headers: {'User-Agent': 'request'}
        }, (err, res, data) => {
            if(err){
                reject('No Google Search response to: '+message.content);
            }else{

                let output = "Suche: \'"+search+"\' \n"+
                    "Einträge: "+data.searchInformation.formattedTotalResults+"\n";

                let attachments = [];
                for(let i = 0; i < data.items.length; i++){
                    let item = data.items[i];

                    attachments[i] =
                        {
                            "color": "#3AA3E3",
                            "attachment_type": "default",
                            "author_name": item.displayLink,
                            "fields": [
                                {
                                    "title": item.title,
                                    "value": item.snippet.replace("\n",""),
                                    "short": false
                                }
                            ],
                            "actions":[
                                {
                                    "name": "anschauen",
                                    "type": "button",
                                    "text": "Anschauen",
                                    "url":item.link
                                }
                            ]
                        };
                }
                resolve(new BotMessage(null, output, self.id, moment().format("YYYY-MM-DD HH:mm:ss"),attachments));
            }
        });
    })
}

var exports = module.exports;
exports.process = process;
exports.initialize = initialize;