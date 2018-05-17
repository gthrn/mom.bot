'use strict';
module.exports = function(app) {
  var standard = require('../controllers/standardController');

  app.route('/tasks')
    .get(standard.standardGet)
    .post(standard.standardPost);
    
};