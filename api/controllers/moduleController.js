'use strict';
let BotModule = require("../models/botModule.js");
let database = require('../../mysql');

//--------------MODULE--------------
// TYPE: GET
// DESC: Returning Module by ID.
exports.getModuleById = function(req, res) {
    database.selectModuleById(req.query.id).then(
        function(result) {
            res.json(result[0]);
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

    let id = json._id ? json._id : null;
    let botModule = new BotModule(id, json._name, json._keyWord, json._active, json._groupKeyWord, json._description, json._pathToFile, json._userName, json._password, json._apiKey);

    if (json._name === null || json._name === undefined) throw new Error();

    if (botModule.id === null) {
        database.insertModule(botModule).then(
            function(result) {
                res.json({'id':result});
            },
            function(err) {
                console.log(err);
            }
        );
    } else {
        database.updateModule(botModule).then(
            function(result) {
                res.json({'id':result});
            },
            function(err) {
                console.log(err);
            }
        );
    }

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
