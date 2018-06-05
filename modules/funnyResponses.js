function process(message) {
    return new Promise(function(resolve, reject) {

        switch(message){
            case "Hello there":
                resolve("General Kenobi...");
                break;
            case "Wen soll ich wählen?":
                resolve("Vote <@UB15RMYDB> or else!... https://tinyurl.com/y9my6od8",  event.channel);
                break;
            default:
                reject('No funny response to: '+message);
        }
    })
}

var exports = module.exports;
exports.process = process;