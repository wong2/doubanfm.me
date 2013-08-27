#-*-coding:utf-8-*-

from album import DoubanAlbum
from flask import Flask, request, make_response
import requests
import json

from gevent import monkey
monkey.patch_all()


app = Flask(__name__)

@app.route('/album/')
def album_api_index():
    return 'Usage: /album-api/[album-id]'

@app.route('/album/<int:album_id>')
def get_album_info(album_id):
    album = DoubanAlbum(album_id)
    return json.dumps({
        'songs': album.get_songs(),
        'cover_image': album.get_cover_image_url()
    })

@app.route('/lyric')
def get_lyric():
    sid = request.args.get('sid')
    ssid = request.args.get('ssid')
    url = 'http://api.douban.com/v2/fm/lyric?sid=%s&ssid=%s' % (sid, ssid)
    r = requests.get(url)
    json_result = r.json()
    data = json.dumps({
        'lyric': json_result.get('lyric')
    })
    response = make_response(data)
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

if __name__ == '__main__':
    app.run(debug=True)
