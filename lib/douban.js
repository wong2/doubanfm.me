// douban api

var cheerio = require('cheerio');
var request = require('request');
var config = require('../config');
var redis = require("redis");

request = request.defaults({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_1) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.172 Safari/537.22',
        'Cookie': config.douban.cookie
    }
});

var redis_client = redis.createClient();
console.log('connected to redis');

var req_api = function(url, callback){
    var api_base_url = 'https://api.douban.com/v2';
    var error = null;
    try {
        url = api_base_url + url + '?apikey=' + config.douban.api_key;
        request(url, function(error, response, body){
            var data = JSON.parse(body);
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

exports.music_tags = function(album_id, callback) {
    var REDIS_PREFIX = 'album-';
    redis_client.get(REDIS_PREFIX + album_id, function(err, reply){
        var tags = [];
        if (reply) {
            tags = JSON.parse(reply);
            console.log("cache: ", tags);
            callback(null, tags);
        } else {
            request('http://music.douban.com/subject/' + album_id, function(error, response, body){
                console.log(body);
                var $ = cheerio.load(body);
                var tags = $('#db-tags-section div.indent a').map(function(){
                    return $(this).text();
                });
                redis_client.set(REDIS_PREFIX + album_id, JSON.stringify(tags));
                console.log("request: ", tags);
                callback(null, tags);
            });
        }
    });
}; 
