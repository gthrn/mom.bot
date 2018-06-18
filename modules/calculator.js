let Message = require('../api/models/message');
let BotMessage = require('../api/models/botMessage');
let moment = require('moment');
let database = require('../mysql');
let self = null;

/**
 * Initializes the module (reads params from DB)
 * @returns {Promise<boolean>}
 */
function initialize() {
    return new Promise(function (resolve, reject) {
        if (self instanceof BotMessage) resolve(self);

        database.selectModuleByFilePath('./modules/calculator').then(
            function (res) {
                self = res[0];
                resolve(res); }
            ,
            function (err) {
                reject(err);
            }
        );
    })
}

/**
 * Tries to process a given message with js eval function
 * @param message
 * @returns {Promise<BotMessage>}
 */
function process(message) {
    return new Promise(function(resolve, reject) {
        if (!message instanceof Message) {
            reject(new Error('Wrong class given'));
        }

        try {
            let result = eval(message.content);
            resolve(new BotMessage(null, message.content + ' = ' + result, null, moment().format("YYYY-MM-DD HH:mm:ss")));
        } catch (e) {
            reject("Calculator cannot calculate!");
        }
    })
}

var exports = module.exports;
exports.process = process;
exports.initialize = initialize;