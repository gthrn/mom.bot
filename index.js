#!/usr/bin/env node
const { IncomingWebhook, WebClient } = require('@slack/client');
let server = require('./server');
let database = require('./mysql');
let mom = require('./mom');

server();
database.initDatabase();
mom.startBot();
