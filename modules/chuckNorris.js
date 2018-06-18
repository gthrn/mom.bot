'use strict';
let request = require('request');
let moment = require('moment');
let Message = require('../api/models/message');
let BotMessage = require('../api/models/botMessage');
let database = require('../mysql');
let self = null;

/**
 * Initializes the module (reads params from DB)
 * @returns {Promise<boolean>}
 */
function initialize() {
    return new Promise(function (resolve, reject) {
        if (self instanceof BotMessage) resolve(self);

        database.selectModuleByFilePath('./modules/chuckNorris').then(
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
 * If the message fits either keywords or chuck norris regex,
 * the function triggers chuck norris api and returns random quote
 * @param message
 * @returns {Promise<BotMessage>}
 */
function process(message) {
    return new Promise(function(resolve, reject) {
        if (!message instanceof Message) {
            reject(new Error('Wrong class given'));
        }
        let url = "http://api.icndb.com/jokes/random";

        let keyWordRegex = new RegExp('^('+self.keyWord+')$', 'mi');
        switch(true){
            case message.content.match(keyWordRegex):
                request.get({
                    url: url,
                    json: true,
                    headers: {'User-Agent': 'request'}
                }, (err, res, data) => {
                    if(err){
                        reject('No Chuck Norris response to: '+message.content);
                    }else{
                        resolve(new BotMessage(null,data.value.joke, self.id, moment().format("YYYY-MM-DD HH:mm:ss")));
                    }
                });
                break;
            case message.content.match(/(.*)chuck(.*)norris/gmi) !== null:
                request.get({
                    url: url,
                    json: true,
                    headers: {'User-Agent': 'request'}
                }, (err, res, data) => {
                    if(err){
                        reject('No Chuck Norris response to: '+message.content);
                    }else{
                        resolve(new BotMessage(null,data.value.joke, self.id, moment().format("YYYY-MM-DD HH:mm:ss")));
                    }
                });
                break;
        }
    })
}

var exports = module.exports;
exports.process = process;
exports.initialize = initialize;