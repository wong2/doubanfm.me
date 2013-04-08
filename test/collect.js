var request = require('request');

var data = {
    "id": "2651695",
    "liked_song_count": 522,
    "blocked_song_count": 11,
    "listened_song_count": 24405,
    "songs": [
        {
            "album_url":"http://music.douban.com/subject/4744841/",
            "album_id":"4744841",
            "album_cover_image":"http://img3.douban.com/spic/s4265576.jpg",
            "song_name":"志明与春娇（原唱：五月天）",
            "performer":"孙燕姿",
            "album_name":"燕姿HIGH翻垦丁"
        }, 
        {
            "album_url":"http://music.douban.com/subject/1920179/",
            "album_id":"1920179",
            "album_cover_image":"http://img3.douban.com/spic/s3697438.jpg",
            "song_name":"一生所爱",
            "performer":"卢冠廷",
            "album_name":"大话西游"
        }
    ]
}

request.post('http://doubanfm.me/collect', { json: { data: JSON.stringify(data) } }, function(error, response, body){
    console.log(body);
});
