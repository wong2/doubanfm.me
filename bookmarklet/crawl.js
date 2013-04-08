/*
 * Crawl all your liked songs on douban fm.
 * 
 */

!function (root){

    function Crawler() {
        this.data = {};

        this.config = {
            base_url : 'http://douban.fm/mine?type=liked&start=',
            index_url: 'http://douban.fm',
            collect_url: 'http://doubanfm.me/collect',
            page_size: 15
        };

        this.init();
    }

    Crawler.prototype = {
        init: function() {
            var navigation_list = $('#navigation li a');

            this.data = {
                liked_song_count   : this._extractNumber(navigation_list[0].innerHTML),
                blocked_song_count : this._extractNumber(navigation_list[1].innerHTML),
                listened_song_count: this._extractNumber(navigation_list[2].innerHTML)
            };
            this.data.songs = [];

            var self = this;
            $.get(this.config.index_url, function(html){
                var id = html.match(/uid:\s*\'(\d+)\'/)[1];
                self.data.id = id;
                self.start();
            });
        },
        _extractNumber: function(str) {
            return parseInt(str.match(/(\d+)/)[0], 10);
        },
        start: function() {
            var current_page = 0;

            this.crawl(current_page, function(song_infos){
                song_infos.each(function(index, song){
                    this.data.songs.push(song);
                }.bind(this));
                current_page += 1;
                console.log('crawling page', current_page);
                if (current_page * this.config.page_size >= this.data.liked_song_count) {
                    this.send();
                } else {
                    this.crawl(current_page, arguments.callee);
                }
            });
        },
        crawl: function(page, callback) {
            var self = this;
            var start_point = page * this.config.page_size,
                url = this.config.base_url + start_point;

            $.get(url, function(html){
                var dom = $(html),
                    info_wrappers = dom.find('.info_wrapper');

                var song_infos = info_wrappers.map(function(){
                    var el = $(this);
                    var song_info = {
                        album_url: el.find('.icon').attr('href'),
                        album_cover_image: el.find('img').attr('src'),
                        song_name: el.find('.song_title').text(),
                        performer: el.find('.performer').text(),
                        album_name: el.find('.source a').text()
                    };
                    try {
                        song_info.album_id = song_info.album_url.match(/(\d+)/)[0];
                    } catch(e) {
                        song_info.album_id = null;
                    }
                    return song_info;
                });

                dom = null;
                
                callback.call(self, song_infos);
            });
        },
        send: function() {
            var data = this.data;
            console.log(data);

            $.ajax({
                type: 'POST',
                url: this.config.collect_url,
                crossDomain: true,
                data: { 'data': JSON.stringify(data) },
                dataType: 'json',
                success: function(response) {
                    if (response.error) {
                        alert(response.msg);
                    } else {
                        alert(response.uid);
                    }
                },
                error: function (response) {
                    alert('POST failed.');
                }
            });
        }
    };

    root.crawler = new Crawler();

}(this);
