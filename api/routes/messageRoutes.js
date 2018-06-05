'use strict';
module.exports = function(app) {
    var standard = require('../controllers/messageController');

    app.route('/messages')
        .get(standard.getMessages)
        .post(standard.standardPost);
    app.route('/messages_amount')
        .get(standard.getMessagesAmount)
        .post(standard.standardPost);

};