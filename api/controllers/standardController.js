'use strict';

exports.standardGet = function(req, res) {
    var ids = ['21','312','32','12','23'];
    res.json(ids);
};

exports.standardPost = function(req, res) {
    res.json('Hello Post');
};