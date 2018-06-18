let mysql      = require('mysql');
let BotModule = require('./api/models/botModule');
let Message = require('./api/models/message');
let BotMessage = require('./api/models/botMessage');

let connection = null;

function initConnection() {
    connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'mom',
        password : 'dicks4ch1cks',
        database : 'mombot'
    });
}

function initDatabase() {
    initConnection();

    connection.query('CREATE TABLE IF NOT EXISTS modules (' +
        'id INT NOT NULL AUTO_INCREMENT,' +
        'name varchar(45),' +
        'key_word varchar(45),' +
        'active bool,' +
        'auth INT,' +
        'group_key_word varchar(45),' +
        'description TEXT,' +
        'path_to_file varchar(255),' +
        'user_name varchar(255),' +
        'password varchar(255),' +
        'api_key varchar(255),' +
        'PRIMARY KEY (id)' +
        ')'
    );

    connection.query('CREATE TABLE IF NOT EXISTS bot_messages (\n' +
        '  id INT NOT NULL AUTO_INCREMENT,\n' +
        '  content TEXT,\n' +
        '  module_id INT,\n' +
        '  time_stamp DATETIME,\n' +
        '  PRIMARY KEY (id),\n' +
        '  FOREIGN KEY (module_id) REFERENCES modules(id)' +
        ')');

    connection.query('CREATE TABLE IF NOT EXISTS messages (\n' +
        '  id INT NOT NULL AUTO_INCREMENT,\n' +
        '  content TEXT,\n' +
        '  user_name varchar(45),\n' +
        '  time_stamp DATETIME,\n' +
        '  processed INT,' +
        '  PRIMARY KEY (id),\n' +
        '  FOREIGN KEY (processed) REFERENCES bot_messages (id)' +
        ')');
}

function insertMessage(message) {
    initConnection();

    return new Promise(function (resolve, reject) {
        if (!message instanceof Message) {
            reject(new Error('Wrong class given'));
        }

        connection.query('INSERT INTO messages (content, user_name, time_stamp) VALUES(?, ?, ?)', [message.content, message.userName, message.timeStamp, message.processed],
            function(err, res) {
                if (err) reject(err);
                resolve(res.insertId);
            });
    });

}


function insertBotMessage(message) {
    initConnection();

    return new Promise(function (resolve, reject) {
        if (!message instanceof BotMessage) {
            reject(new Error('Wrong class given'));
        }

        connection.query('INSERT INTO bot_messages (content, module_id, time_stamp) VALUES(?, ?, ?)', [message.content, message.moduleId, message.timeStamp],
            function(err, res) {
                if (err) reject(err);
                resolve(res.insertId);
            });
    });

}


function updateMessage(message) {
    initConnection();

    return new Promise(function (resolve, reject) {
        if (!message instanceof Message) {
            reject(new Error('Wrong class given'));
        }

        connection.query('UPDATE messages SET processed = ? WHERE id = ?', [message.processed, message.id],
            function(err, res) {
                if (err) reject(err);
                resolve(res);
            });
    });

}

function selectMessageAmount(startDate,endDate){
    initConnection();

    return new Promise(function (resolve, reject) {
        let query_str = 'SELECT COUNT(id) as amount FROM messages';
        if(startDate != null && endDate != null){
                connection.query(query_str + ' WHERE time_stamp > ? AND time_stamp < ? ', [startDate, endDate],
                    function (err, res) {
                        if (err) reject(err);
                        if (!res) reject("Something went wrong");
                        resolve(res[0].amount);
                    })
        } else {
            connection.query(query_str,
                function (err, res) {
                    if (err) reject(err);
                    resolve(res[0].amount);
                })
        }
    });
}

function selectBotMessageAmount(startDate,endDate){
    initConnection();

    return new Promise(function (resolve, reject) {
        let query_str = 'SELECT COUNT(id) as amount FROM bot_messages';
        if(startDate != null && endDate != null){
                connection.query(query_str + ' WHERE time_stamp > ? AND time_stamp < ? ', [startDate, endDate],
                    function (err, res) {
                        if (err) reject(err);
                        resolve(res[0].amount);
                    })
        } else {
            connection.query(query_str,
                function (err, res) {
                    if (err) reject(err);
                    resolve(res[0].amount);
                })
        }
    });
}

function selectMessages(startDate, endDate) {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM messages  WHERE time_stamp > ? AND time_stamp < ?', [startDate, endDate], function(err,res) {
            if (err) reject(err);
            let messages = [];
            for (let i = 0; i < res.length; i++) {
                let message = new Message(res[i].id, res[i].content, res[i].user_name, res[i].time_stamp, res[i].processed);
                messages.push(message);
            }
            resolve(messages);
        })
    })
}

function selectBotMessages(startDate, endDate) {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM bot_messages  WHERE time_stamp > ? AND time_stamp < ?', [startDate, endDate], function(err,res) {
            if (err) reject(err);
            let messages = [];
            for (let i = 0; i < res.length; i++) {
                let message = new BotMessage(res[i].id, res[i].content, res[i].module_id, res[i].time_stamp);
                messages.push(message);
            }
            resolve(messages);
        })
    })
}

function selectBotMessageById(id) {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM bot_messages  WHERE id=?', [id], function(err,res) {
            if (err) reject(err);
            let messages = [];
            for (let i = 0; i < res.length; i++) {
                let message = new BotMessage(res[i].id, res[i].content, res[i].module_id, res[i].time_stamp);
                messages.push(message);
            }
            resolve(messages);
        })
    })
}

function insertModule(moduleObj) {
    return new Promise(function(resolve, reject) {
        if (!moduleObj instanceof BotModule) {
            reject(new Error('Wrong class given'));
        }
        connection.query('INSERT INTO modules (name, key_word, active, group_key_word, description, path_to_file, user_name, password, api_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)' , [moduleObj.name, moduleObj.keyWord, moduleObj.active, moduleObj.groupKeyWord, moduleObj.description, moduleObj.pathToFile, moduleObj.userName, moduleObj.password, moduleObj.apiKey], function(err, res) {
            if (err) reject(err);
            resolve(res.insertId);
        });
    })
}

function updateModule(module) {
    return new Promise(function(resolve, reject) {
        if (!module instanceof BotModule) {
            reject(new Error('Wrong class given'));
        }

        if (module.id === undefined || module.id === null) reject(new Error('ID is not set'));

        connection.query('UPDATE modules SET name = ?, key_word = ?, active = ?, group_key_word = ?, description = ?, path_to_file = ?, user_name = ?, password = ?, api_key = ? WHERE id = ?', [module.name, module.keyWord, module.active, module.groupKeyWord, module.description, module.pathToFile, module.userName, module.password, module.apiKey, module.id], function(err, res) {
            if (err) reject(err);
            resolve(res.insertId);
        });
    })
}

function selectAllModules(active = true) {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM modules WHERE active = ?', [active], function(err,res) {
            if (err) reject(err);
            let objects = [];
            for (let i = 0; i < res.length; i++) {
                let obj = new BotModule(null, res[i].name, res[i].key_word, res[i].active, res[i].group_key_word, res[i].description, res[i].path_to_file, res[i].user_name, res[i].password, res[i].api_key);
                objects.push(obj);
            }
            resolve(objects);
        })
    })
}

function selectModuleById(id) {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM modules WHERE id = ?', [id], function(err,res) {
            if (err) reject(err);
            let objects = [];
            for (let i = 0; i < res.length; i++) {
                let obj = new BotModule(res[i].id, res[i].name, res[i].key_word, res[i].active, res[i].group_key_word, res[i].description, res[i].path_to_file, res[i].user_name, res[i].password, res[i].api_key);
                objects.push(obj);
            }
            resolve(objects);
        })
    })
}

function selectModuleByFilePath(filePath) {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM modules WHERE path_to_file LIKE ?', [filePath], function(err,res) {
            if (err) reject(err);
            let objects = [];
            for (let i = 0; i < res.length; i++) {
                let obj = new BotModule(res[i].id, res[i].name, res[i].key_word, res[i].active, res[i].group_key_word, res[i].description, res[i].path_to_file, res[i].user_name, res[i].password, res[i].api_key);
                objects.push(obj);
            }
            resolve(objects);
        })
    })
}

function selectAllModuleIds() {{
    return new Promise(function (resolve, reject) {
        connection.query('SELECT id FROM modules', function(err,res) {
            if (err) reject(err);
            let ids = [];
            for (let i = 0; i < res.length; i++) {
                ids.push(res[i].id);
            }
            resolve(ids);
        })
    })
}

}

var exports = module.exports;
exports.initDatabase = initDatabase;
exports.insertMessage = insertMessage;
exports.insertBotMessage = insertBotMessage;
exports.updateMessage = updateMessage;
exports.selectMessageAmount = selectMessageAmount;
exports.selectBotMessageAmount = selectBotMessageAmount;
exports.insertModule = insertModule;
exports.updateModule = updateModule;
exports.selectAllModules = selectAllModules;
exports.selectModuleById = selectModuleById;
exports.selectModuleByFilePath = selectModuleByFilePath;
exports.selectAllModuleIds = selectAllModuleIds;
exports.selectMessages = selectMessages;
exports.selectBotMessages = selectBotMessages;
exports.selectBotMessageById = selectBotMessageById;