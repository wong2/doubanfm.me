// douban api

var cheerio = require('cheerio');
var request = require('request');
var config = require('../config/douban');

var cookie_jar = request.jar();
cookie_jar.add(request.cookie(config.COOKIE_STRING));
request = request.defaults({jar:cookie_jar});

var api_base_url = 'https://api.douban.com/v2'

var req_api = function(url, callback){
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
    req_api('/user/' + user_id, callback);
};

exports.music_info = function(album_id, callback) {
    req_api('/music/' + album_id, callback);
};

exports.music_tags = function(album_id, callback) {
    request('http://music.douban.com/subject/' + album_id, function(error, response, body){
        var $ = cheerio.load(body);
        var tags = $('#db-tags-section div.indent a').map(function(){
            return $(this).text();
        });
        callback(null, tags);
    });
};
