'use strict';
let request = require('request');
let moment = require('moment');
let Message = require('../api/models/message');
let BotMessage = require('../api/models/botMessage');
let database = require('../mysql');
let self = null;

function initialize() {
    return new Promise(function (resolve, reject) {
        if (self instanceof BotMessage) resolve(self);

        database.selectModuleByFilePath('./modules/funnyTrumpQuotes').then(
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
 * If the message fits one of the regex's , triggers TrumpQuoteApi and returns a quote
 * @param message
 * @returns {Promise<BotMessage>}
 */
function process(message) {
    return new Promise(function(resolve, reject) {
        if (!message instanceof Message) {
            reject(new Error('Wrong class given'));
        }

        let regexPersonalized = /(Was\ssagt\sTrump\szu)\s(\w*)/im;
        let regexRandom= /(Was\ssagt\sTrump\sdazu)/im;
        let keyWordRegex = new RegExp('^('+self.groupKeyWord+'\\s'+self.keyWord+'|'+self.keyWord+')','mi');

        let match = null;
        switch(true){
            case (match = message.content.match(keyWordRegex)) != null:
                trumpQuote(match,true).then(function (res, err) {
                    if (err) reject(err);
                    resolve(res);
                });
                break;
            case (match = message.content.match(regexPersonalized)) != null:
                trumpQuote(match,false).then(function (res, err) {
                    if (err) reject(err);
                    resolve(res);
                });
                break;
            case (match = message.content.match(regexRandom)) != null:
                trumpQuote(match,true).then(function (res, err) {
                    if (err) reject(err);
                    resolve(res);
                });
                break;
            default:
                reject('No Trump Quotes')
        }
    })
}

function trumpQuote(match,random) {
    return new Promise(function(resolve, reject) {

        let trumpPictures = [];
        trumpPictures[0] = "https://www.nyacknewsandviews.com/wp-content/uploads/2016/03/trump-600x450.jpg";
        trumpPictures[1] = "http://www.fullredneck.com/wp-content/uploads/2016/03/Funny-Donald-Trump-Jokes.jpg";
        trumpPictures[2] = "https://www.telegraph.co.uk/content/dam/news/2016/11/05/112941187_trump%20news_trans_NvBQzQNjv4Bqeo_i_u9APj8RuoebjoAHt0k9u7HhRJvuo-ZLenGRumA.jpg?imwidth=450";
        trumpPictures[3] = "http://thisiswhyimweird.com/wp-content/uploads/2016/12/phillip-kremer-donald-trump-1.jpg?x61498";

        let rmdNumber = Math.floor(Math.random() * Math.floor(4));

        let url = null;

        if(random) url = "https://api.whatdoestrumpthink.com/api/v1/quotes/random";
        else url = "https://api.whatdoestrumpthink.com/api/v1/quotes/personalized?q="+match[2];

        request.get({
            url: url,
            json: true,
            headers: {'User-Agent': 'request'}
        }, (err, res, data) => {
            if(err){
                reject('No Cat response to: '+match[0]);
            }else{
                let attachments = [{
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "image_url": trumpPictures[rmdNumber],
                    "author_name": "Donald Trump"
                }];
                resolve(new BotMessage(null,data.message, self.id, moment().format("YYYY-MM-DD HH:mm:ss"),attachments));
            }
        });

    })
}

var exports = module.exports;
exports.process = process;
exports.initialize = initialize;