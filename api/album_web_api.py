#-*-coding:utf-8-*-

from album import DoubanAlbum
from flask import Flask
import json

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

if __name__ == '__main__':
    from gevent import monkey
    monkey.patch_all()

    app.run(debug=True)
