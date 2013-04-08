var request = require('request');

var api_base_url = 'https://api.douban.com/v2'

// get album info by album id
exports.get = function(album_id, callback) {
    var error = null;
    request(api_base_url + '/music/' + album_id, function(error, response, body){
        var data = JSON.parse(body);
        callback(error, data);
    });
};

exports.tags = function(album_id, callback) {
    var error = null;
    request(api_base_url + '/music/' + album_id + '/tags', function(error, response, body){
        var data = JSON.parse(body);
        callback(error, data);
    });
};
