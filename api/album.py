#-*-coding:utf-8-*-

import requests
import grequests
from pyquery import PyQuery as PQ


class DoubanAlbum:

    def __init__(self, album_id):
        self.album_id = album_id
        self.fetch_page()

    def fetch_page(self):
        album_page_url = 'http://music.douban.com/subject/%d' % self.album_id
        r = requests.get(album_page_url)
        self.dom = PQ(r.text)

    def get_cover_image_url(self):
        image_tag = self.dom('#mainpic img')
        return image_tag.attr('src')

    def get_songs(self):
        self.songs = self.extract_song_list()
        try:
            self.fetch_song_mp3_url()
        except KeyError:
            pass
        return self.songs

    def extract_song_list(self):
        song_item_li_s = self.dom('.song-item')

        # no more song infos, just names
        if not song_item_li_s:
            text = self.dom('.related_info .indent')[1].text_content()
            import re
            words = [word for word in re.split('(\d+)\.', text) if word]
            return [{'name': song_name} for song_name in words[1::2]]

        return [{
                    'sid': song_item_li.get('id'),
                    'ssid': song_item_li.get('data-ssid'),
                    'name': song_item_li.find_class('song-name')[0].get('data-title')
                } for song_item_li in song_item_li_s]

    def fetch_song_mp3_url(self):
        url_format = 'http://music.douban.com/j/songlist/get_song_url?sid={sid}&ssid={ssid}'
        urls = (url_format.format(**song) for song in self.songs)
        rs = (grequests.get(u) for u in urls)
        for i, r in enumerate(grequests.map(rs)):
            response = r.json()
            self.songs[i]['mp3_url'] = response['r']

            
if __name__ == '__main__':
    album = DoubanAlbum(5369939)
    print album.get_songs()
