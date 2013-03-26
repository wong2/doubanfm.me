/*
 * Crawl all your liked songs on douban fm.
 * 
 */

!function (root){

    function Crawler() {
        this.data = {};

        this.config = {
            base_url : 'http://douban.fm/mine?type=liked&start=',
            page_size: 15
        };

        this.songs = [];

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

            this.start();
        },
        _extractNumber: function(str) {
            return parseInt(str.match(/(\d+)/)[0], 10);
        },
        start: function() {
            var current_page = 0;

            this.crawl(current_page, function(song_infos){
                song_infos.each(function(index, song){
                    this.songs.push(song);
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
                    return {
                        album_url: el.find('.icon').attr('href'),
                        album_cover_image: el.find('img').attr('src'),
                        song_name: el.find('.song_title').text(),
                        performer: el.find('.performer').text(),
                        album_name: el.find('.source a').text()
                    };
                });
                
                callback.call(self, song_infos);
            });
        },
        send: function() {
            var data = this.data;
            data.songs = this.songs;
            console.log(data);
        }
    };

    root.crawler = new Crawler();

}(this);
