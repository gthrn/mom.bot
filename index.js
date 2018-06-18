#!/usr/bin/env node
const { IncomingWebhook, WebClient } = require('@slack/client');
let server = require('./server');
let database = require('./mysql');
let mom = require('./mom');
let moment = require('moment');

moment.locale('de');
server();
database.initDatabase();
mom.startBot();
