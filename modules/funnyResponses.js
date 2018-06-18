let Message = require('../api/models/message');
let BotMessage = require('../api/models/botMessage');
let database = require('../mysql');
let moment = require('moment');
let self = null;

function initialize() {
    return new Promise(function (resolve, reject) {
        if (self instanceof BotMessage) resolve(self);

        database.selectModuleByFilePath('./modules/funnyResponses').then(
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
 * If the message fits one of the regex's or exact quote, returns a BotMessage with content
 * TODO: Put possible Answers and Questions to database
 * @param message
 * @returns {Promise<BotMessage>}
 */
function process(message) {

    return new Promise(function(resolve, reject) {
        if (!message instanceof Message) {
            reject(new Error('Wrong class given'));
        }
        switch(message.content){
            case "Hello there":
                resolve(new BotMessage(null, "General Kenobi...", self.id, moment().format("YYYY-MM-DD HH:mm:ss")));
                break;
            case "Wen soll ich wählen":
                resolve(new BotMessage(null, "Vote <@UB15RMYDB> or else!... https://tinyurl.com/y9my6od8?uncache="+moment(),  self.id, moment().format("YYYY-MM-DD HH:mm:ss")));
                break;
            case "Hey du":
                resolve(new BotMessage(null, "Beep boop bee beep (Invites you to exchange some data & post requests).", self.id, moment().format("YYYY-MM-DD HH:mm:ss")));
                break;
            case "Was geht ab?":
                resolve(new BotMessage(null, "Fisch und Beine.", self.id, moment().format("YYYY-MM-DD HH:mm:ss")));
                break;
            case "KB":
            case "Kein Bock":
            case "Keine Lust":
                resolve(new BotMessage(null, "COMRADE!! "+Math.floor((Math.random()*10000))+" PUSHUPS, DO IT FOR OUR BELOVED LEADER!", self.id, moment().format("YYYY-MM-DD HH:mm:ss")));
                break;
            case 'idt':
                resolve(new BotMessage(null, 'https://i.imgflip.com/2cf7w9.jpg?uncache='+moment(), self.id, moment().format()));
                break;
            case 'jdi':
                resolve(new BotMessage(null, 'http://memesguy.com/wp-content/uploads/2018/01/just-do-it.jpg?uncache='+moment(), self.id, moment().format()));
                break;
        }

        let cartmanRegex = /^Mo*m\s*,*\s*Schüssel!*$/gmi;
        let jokeRegex = /(.*)tell(.*)joke/gmi;
        let dirtyRegex = /(.*)talk(.*)dirty/gmi;
        switch (true) {
            case message.content.match(cartmanRegex) != null:
                resolve(new BotMessage(null, "Ich komme schon, Pupsi Bär!", self.id, moment().format("YYYY-MM-DD HH:mm:ss")));
                break;
            case message.content.match(jokeRegex) != null:
                resolve(new BotMessage(null, "Gehen ein Pole, ein Ossi und ein Wessi durch den Wald. Plötzlich erscheint eine Fee und erlaubt jedem einen Wunsch. \n" +
                    "Pole: 'Ich will, dass jeder Pole ein Auto hat!'\n" +
                    "Ossi: 'Ich will, dass die Mauer wieder steht!\n'" +
                    "Wessi: 'Jeder Pole hat ein Auto und die Mauer steht wieder?'\n" +
                    "Fee: 'Ja'\n" +
                    "Wessi: 'Kannst du Kaffee kochen?'\n", self.id, moment().format("YYYY-MM-DD HH:mm:ss")));
                break;
            case message.content.match(dirtyRegex) != null:
                resolve(new BotMessage(null, "Sure, Honey:\n" +
                    "Clothes\n" +
                    "Floor\n" +
                    "Dishes\n", self.id, moment().format("YYYY-MM-DD HH:mm:ss")));
                break;
        }

        reject('No funny response to: '+message.content);

    })

}

var exports = module.exports;
exports.process = process;
exports.initialize = initialize;