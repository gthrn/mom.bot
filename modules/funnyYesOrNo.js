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

        database.selectModuleByFilePath('./modules/funnyYesOrNo').then(
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
 * If the message fits one of the regex's , returns yes or no with a picture/gif
 * @param message
 * @returns {Promise<BotMessage>}
 */
function process(message) {
    return new Promise(function(resolve, reject) {
        if (!message instanceof Message) {
            reject(new Error('Wrong class given'));
        }

        let regex = /^(Ist|Soll|Darf|Muss)\s(.*)/mi;
        let keyWordRegex = new RegExp('^('+self.groupKeyWord+'\\s'+self.keyWord+'|'+self.keyWord+')','mi');

        let match = null;
        switch(true){
            case (match = message.content.match(keyWordRegex)) != null:
                yesOrNo(match[0]).then(function (res, err) {
                    if (err) reject(err);
                    resolve(res);
                });
                break;
            case (match = message.content.match(regex)) != null:
                yesOrNo(match[0]).then(function (res, err) {
                    if (err) reject(err);
                    resolve(res);
                });
                break;
            default:
                reject('No answers')
        }
    })
}
function yesOrNo(message) {
    return new Promise(function(resolve, reject) {
        let url = "https://yesno.wtf/api/";

        request.get({
            url: url,
            json: true,
            headers: {'User-Agent': 'request'}
        }, (err, res, data) => {
            if(err){
                reject('No YesOrNo response to: '+message);
            }else{
                let attachments = [{
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "author_name":message,
                    "image_url": data.image,
                }];
                resolve(new BotMessage(null,data.answer, self.id, moment().format("YYYY-MM-DD HH:mm:ss"),attachments));

            }
        });
    });
}

var exports = module.exports;
exports.process = process;
exports.initialize = initialize;