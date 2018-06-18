'use strict';
module.exports = function(app) {
    var standard = require('../controllers/messageController');

    app.route('/messages')
        .get(standard.getMessages)
        .post(standard.standardPost);
    app.route('/messages_amount')
        .get(standard.getMessagesAmount)
        .post(standard.standardPost);

    app.route('/bot_message')
        .get(standard.getBotMessage);
    app.route('/bot_messages')
        .get(standard.getBotMessages)
        .post(standard.standardPost);
    app.route('/bot_messages_amount')
        .get(standard.getBotMessagesAmount)
        .post(standard.standardPost);

};