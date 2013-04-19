mongo = require 'mongoskin'
async = require 'async'
_ = require 'underscore'
douban = require '../lib/douban'
config = require '../config'

db = mongo.db config.mongo.server

# get tags of musics the user likes
get_tags = (album_ids, callback) ->
  parallel_req_limit = 5
  async.mapLimit album_ids, parallel_req_limit, douban.music_tags, (err, results) ->
    tags = {}
    for result in results
      for tag in result
        tags[tag] = (tags[tag] or 0) + 1

    console.log tags, results

    delete tags[tag] for tag, count of tags when count <= 1
      
    callback null, tags

exports.process = (job, done) ->
  console.log job.data
  db.collection('raw_data').findOne id:job.data.id, (err, item) ->
    job.log 'processing %s(%s), who has %s liked songs', item.uid, item.id, item.liked_song_count

    album_ids = _.compact _.pluck item.songs, 'album_id'
    get_tags album_ids, (error, tags) ->
      console.log tags
      done()
