const { RTMClient } = require('@slack/client');
let database = require('./mysql');
let moment = require('moment');

let botModules = [];


// An access token (from your Slack app or custom integration - usually xoxb)
const token = 'xoxb-365163026887-374914148131-kEBzeEy8r0sCgbYdcBbqfkSr';

// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);

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
            (!event.subtype && event.user === rtm.activeUserId) ) {
            return;
        }

        let content = event.text;
        let date = moment.unix(event.ts).format("YYYY-MM-DD HH:mm:ss");
        let user = event.user;

        let messageId = null;
        database.insertMessage(user, content, date).then(
            function(res) {
                messageId = res;
            },
            function(err) {

            }
        );

        let failedModulesCount = 0;
        for (let i = 0; i < botModules.length; i++) {
            botModules[i].process(content).then(
                function(res) {
                    rtm.sendMessage(res, event.channel).then().catch(error=>{console.log(error)});
                },
                function (err) {
                    console.log(err);
                    failedModulesCount++;
                    if (failedModulesCount === botModules.length) {
                        rtm.sendMessage("It seems I do not quite understand what you mean with '" +content+"'", event.channel).then().catch(error=>{console.log(error)});
                    }
                }
            );

        }

    });
}

var exports = module.exports;
exports.startBot = startBot;

