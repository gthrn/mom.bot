#!/usr/bin/env node
const { IncomingWebhook, WebClient } = require('@slack/client');
let server = require('./server');

server();
