'use strict';
let request = require('request');
let SpotifyWebApi = require('spotify-web-api-node');
let Message = require('../api/models/message');
let BotMessage = require('../api/models/botMessage');
let database = require('../mysql');
let moment = require('moment');
let self = null;
let spotifyApi = null;

function initialize() {
    return new Promise(function (resolve, reject) {
        if (self instanceof BotMessage) resolve(self);

        database.selectModuleByFilePath('./modules/spotify').then(
            function (res) {
                self = res[0];
                if (spotifyApi === null || spotifyApi === undefined ) {



                    spotifyApi = new SpotifyWebApi({
                        clientId: self.userName,
                        clientSecret: self.password,
                        redirectUri: 'http://www.example.com/callback'
                    });

                    spotifyApi.setRefreshToken(self.apiKey);

                }
                spotifyApi.refreshAccessToken().then(
                    function(data) {

                        // Save the access token so that it's used in future calls
                        spotifyApi.setAccessToken(data.body['access_token']);
                        resolve(true);

                    },
                    function(err) {
                        reject(err);
                    }
                );}
            ,
            function (err) {
                reject(err);
            }
        );




    });
}

/**
 * Tries to process a message.
 * If the message fits one of the regex's , triggers SpotifyApi and searches for searchterm then returns the results
 * @param message
 * @returns {Promise<BotMessage>}
 */
function process(message) {
    return new Promise(function(resolve, reject) {
        if (!message instanceof Message) {
            reject(new Error('Wrong class given'));
        }

        let keyWordRegex = new RegExp('^('+self.keyWord+' (.*))$', 'mi');
        let artistSearchRegex = /(sings|sang|wrote|singt|performs) (.*)?/mi;
        let communismRegex = /(communism|commy|stalin|motherland)/mi;
        let matches = null;
        switch (true) {
            case (matches = message.content.match(keyWordRegex)) != null:
                try {
                    searchForTrack(matches[2]).then(function(res) {resolve(res)});
                } catch (err) {
                    reject(err);
                }
                break;
            case (matches = message.content.match(artistSearchRegex)) != null:
                try {
                    searchForTrack(matches[2]).then(function(res) {resolve(res)});
                } catch (err) {
                    reject(err);
                }
                break;
            case (matches = message.content.match(communismRegex)) != null:
                try {
                    searchForTrack('USSR National Anthem').then(function(res) {resolve(res)});
                } catch (err) {
                    reject(err);
                }
                break;

        }

    })
}

function searchForTrack(search) {
    return new Promise(function(resolve, reject) {
        spotifyApi.searchTracks(search)
            .then(function (data) {
                let artist = data.body.tracks.items[0].artists[0].name;
                let track = data.body.tracks.items[0].name;
                let trackUrl = data.body.tracks.items[0].external_urls.spotify;
                let content = track + ' is performed by ' + artist;
                resolve (new BotMessage(null, content, self.id, moment().format("YYYY-MM-DD HH:mm:ss"), [
                    {
                        "fallback": content,
                        "color": "#36a64f",
                        "author_name": artist,
                        "author_link": data.body.tracks.items[0].artists[0].external_urls.spotify,
                        "title": track,
                        "actions": [
                            {
                                "name": "listen",
                                "type": "button",
                                "text": "Anhören",
                                "url": trackUrl
                            }
                        ]
                    }
                ]));
            }, function (err) {
                throw err;
            });
    })
}

var exports = module.exports;
exports.process = process;
exports.initialize = initialize;