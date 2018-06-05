'use strict';
let ModuleClass = require("../models/botModule.js");
let database = require('../../mysql');

//--------------MODULE--------------
// TYPE: GET
// DESC: Returning Module by ID.
exports.getModuleById = function(req, res) {
    database.selectModuleById(req.query.id).then(
        function(result) {
            res.json({"module":result[0]});
        },
        function(err) {
            console.log(err);
        }
    );


};

// TYPE: POST
// DESC: Inserting Module Object via JSON.
exports.insertModuleObject = function(req, res) {
    let json = req.body;

    if(json.active === "true") json.active = 1;
    else json.active = 0;

    let botModule = new BotModule(null, json.name, json.keyWord, json.active, json.groupKeyWord, json.description, json.pathToFile, json.userName, json.password, json.apiKey);

    database.insertModule(botModule).then(
        function(result) {
            res.json({'id':result});
        },
        function(err) {
            console.log(err);
        }
    );

};
//--------------MODULES--------------
// TYPE: GET
// DESC: Returning All Module IDs.
exports.getAllModules = function(req, res) {
    database.selectAllModuleIds().then(
        function(result) {
            res.json({'modules':result});
        },
        function(err) {
            console.log(err);
        }
    );
};

// TYPE: POST
// DESC: Hello Post
exports.standardPost = function(req, res) {
    res.json('Hello Post');
};
