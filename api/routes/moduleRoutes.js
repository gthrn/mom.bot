'use strict';
module.exports = function(app) {
    var module = require('../controllers/moduleController');

    app.route('/module')
        .get(module.getModuleById)
        .post(module.insertModuleObject);
    app.route('/modules')
        .get(module.getAllModules)
        .post(module.insertModuleObject);

};