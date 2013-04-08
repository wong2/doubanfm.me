// douban api

var request = require('request');
var config = require('../config/douban');

var api_base_url = 'https://api.douban.com/v2'

var req = function(url, callback){
    var error = null;
    try {
        url = api_base_url + url + '?apikey=' + config.API_KEY;
        request(url, function(error, response, body){
            var data = JSON.parse(body);
            console.log(data);
            if (data.code) {
                callback(data.code, data);
            } else {
                callback(error, data);
            }
        });
    } catch (error) {
        callback(error, null);
    }
};

exports.user_info = function(user_id, callback) {
  req('/user/' + user_id, callback);
};

exports.music_info = function(album_id, callback) {
    req('/music/' + album_id, callback);
};

exports.music_tags = function(album_id, callback) {
    req('/music/' + album_id + '/tags', callback);
};
