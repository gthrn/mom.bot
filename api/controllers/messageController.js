'use strict';
let database = require('../../mysql');

//--------------Messages--------------
// TYPE: GET
// DESC: Returning Messages of a period.
exports.getMessages = function (req, res) {
    database.selectMessages(req.query.startdate,req.query.enddate).then(
        function(result) {
            res.json({'messages':result});
        },
        function(err) {
        }
    );
};
//--------------Messages Amount--------------
// TYPE: GET
// DESC: Returning Amount of Messages for a period.
exports.getMessagesAmount = function (req, res) {
    database.selectMessageAmount(req.query.startdate,req.query.enddate).then(
        function(result) {
            res.json({'amount':result});
        },
        function(err) {
        }
    );
};

//--------------BotMessage--------------
// TYPE: GET
// DESC: Returning Message by ID.
exports.getBotMessage = function(req, res) {
    database.selectBotMessageById(req.query.id).then(
        function(result) {
            res.json(result[0]);
        },
        function(err) {
            console.log(err);
        }
    );


};

//--------------BotMessages--------------
// TYPE: GET
// DESC: Returning Messages of a period.
exports.getBotMessages = function (req, res) {
    database.selectBotMessages(req.query.startdate,req.query.enddate).then(
        function(result) {
            res.json({'messages':result});
        },
        function(err) {
        }
    );
};
//--------------BotMessages Amount--------------
// TYPE: GET
// DESC: Returning Amount of Messages for a period.
exports.getBotMessagesAmount = function (req, res) {
    database.selectBotMessageAmount(req.query.startdate,req.query.enddate).then(
        function(result) {
            res.json({'amount':result});
        },
        function(err) {
        }
    );
};


//--------------Standart--------------
// TYPE: POST
// DESC: Default Post Function.
exports.standardPost = function(req, res) {
    res.json('Briefkasten is empty. Post not found.');
};