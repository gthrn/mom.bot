const { RTMClient, WebClient } = require('@slack/client');
let database = require('./mysql');
let moment = require('moment');
let Message = require('./api/models/message');

let botModules = [];


// An access token (from your Slack app or custom integration - usually xoxb)
const token = 'xoxb-365163026887-374914148131-kEBzeEy8r0sCgbYdcBbqfkSr';

// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
const webClient = new WebClient(token);

function startBot() {

    database.selectAllModules().then(function (res) {
        for (let i = 0; i < res.length; i++) {
            botModules.push(require(res[i].pathToFile));
        }
    });
    rtm.start();

    rtm.on('message', (event) => {
        // For structure of `event`, see https://api.slack.com/events/message
        // Skip messages that are from a bot or my own user ID
        if ( (event.subtype && event.subtype === 'bot_message') ||
            (!event.subtype && event.user === rtm.activeUserId) ||
            (event.text == null)) {
            return;
        }

        let commandRegex = /!(\w+)/;

        let text =event.text.replace(commandRegex, replaceCommands);

        let message = new Message(null, text, event.user, moment.unix(event.ts).format("YYYY-MM-DD HH:mm:ss"), null);

        database.insertMessage(message).then(
            function(res) {
                message.id = res;
            },
            function(err) {

            }
        );

        let failedModulesCount = 0;
        for (let i = 0; i < botModules.length; i++) {
            botModules[i].initialize().then(
                function (res) {
                    botModules[i].process(message).then(
                        function(res) {
                            webClient.chat.postMessage({
                                channel: event.channel,
                                text: res.content,
                                attachments: res.attachments
                            })
                                .then((res) => {
                                    // `res` contains information about the posted message
                                })
                                .catch(console.error);
                            database.insertBotMessage(res).then(
                                function (res) {
                                    message.processed = res;
                                    database.updateMessage(message).then(
                                        function (res) {
                                            //Message is updated. Result is in res
                                        },
                                        function (err) {
                                            console.log(err)
                                            //Message could not be updated. error is in err
                                        }
                                    );
                                })
                            ;
                        },
                        function (err) {
                            console.log(err);
                            failedModulesCount++;
                            if (failedModulesCount === botModules.length) {
                                rtm.sendMessage("It seems I do not quite understand what you mean with '" +message.content+"'", event.channel).then().catch(error=>{console.log(error)});
                            }
                        }
                    );
                },
                function(err) {
                    console.log(err);
                }
            );

        }

    });
}

function replaceCommands(match, p1) {
    switch (p1) {
        case 'now':
            return moment().format("YYYY-MM-DD HH:mm:ss");
        case 'today':
        case 'time':
            return moment().format("DD MMMM YYYY");
    }
}

var exports = module.exports;
exports.startBot = startBot;

