let Message = require('../api/models/message');
let BotMessage = require('../api/models/botMessage');
let database = require('../mysql');
let moment = require('moment');
let GoogleNewsRss = require('google-news-rss');
let self = null;

function initialize() {
    return new Promise(function (resolve, reject) {
        if (self instanceof BotMessage) resolve(self);

        database.selectModuleByFilePath('./modules/googleNews').then(
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
 * If the message fits one of the regex's , triggers GoogleNewsApi and searches for searchterm then returns the results
 * @param message
 * @returns {Promise<BotMessage>}
 */
function process(message) {
    return new Promise(function(resolve, reject) {
        if (!message instanceof Message) {
            reject(new Error('Wrong class given'));
        }

        let regex = /^News\s(zu|)\s(.*)?$/mi;
        let keyWordRegex = new RegExp('^('+self.groupKeyWord+'\\s'+self.keyWord+'|'+self.keyWord+')\\s(.*)$','mi');

        let match = null;
        switch(true){
            case (match = message.content.match(keyWordRegex)) != null:
                searchNews(match[2]).then(function (res, err) {
                    if (err) reject(err);
                    resolve(res);
                });
                break;
            case (match = message.content.match(regex)) != null:
                searchNews(match[2]).then(function (res, err) {
                    if (err) reject(err);
                    resolve(res);
                });
                break;
            default:
                reject('No news')
        }
    })
}

function searchNews(search) {
    return new Promise(function (resolve, reject) {
        let googleNews = new GoogleNewsRss();
        googleNews
            .search(search,5,"de")
            .then(function(ret, err){
                if (err) reject(err);
                let output = "News-Suche: \'"+search+"\' \n"+
                    "Artikel: "+ret.length+"\n";
                let attachments = [];
                for(let i = 0; i < 3; i++){
                    let item = ret[i];

                    attachments[i] =
                        {
                            "color": "good",
                            "attachment_type": "default",
                            "thumb_url": item.thumbnailUrl,
                            "author_name": item.publisher,
                            "fields": [
                                {
                                    "title": item.title,
                                    "value": item.description,
                                    "short": false
                                }
                            ],
                            "actions":[
                                {
                                    "name": "lesen",
                                    "type": "button",
                                    "text": "Lesen",
                                    "url":item.link
                                }
                            ]
                        };
                }
                attachments[attachments.length+1] = {
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "author_name": "Über "+ret.length+" Artikel zu dem Thema gefunden.",
                    "actions":[
                        {
                            "name": "showMore",
                            "type": "button",
                            "text": "Mehr Anzeigen",
                            "url": "https://news.google.com/search?q="+search+"&hl=de"
                        }
                    ]
                };
                resolve(new BotMessage(null, output, self.id, moment().format("YYYY-MM-DD HH:mm:ss"),attachments));
            });
    })
}

var exports = module.exports;
exports.process = process;
exports.initialize = initialize;