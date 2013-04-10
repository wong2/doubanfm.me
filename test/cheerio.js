var cheerio = require('cheerio'),
    request = require('request');

request('http://music.douban.com/subject/3236064', function(error, response, body){
    var $ = cheerio.load(body);
    var tags = $('#db-tags-section div.indent a').map(function(){
        return $(this).text();
    });
    console.log(tags);
});
