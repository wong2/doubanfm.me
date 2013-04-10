mongodb = require 'mongodb'
async = require 'async'
_ = require 'underscore'
douban = require '../lib/douban'

mongo = mongodb.MongoClient
stats_collection = raw_data_collection = null

connectMongo = (callback) ->
  mongo.connect 'mongodb://localhost:27017/doubanfm', (err, db) ->
    if not err
      console.log 'stats connected to mongodb'
      raw_data_collection = db.collection 'raw_data'
      stats_collection = db.collection 'stats_data'
      callback()
    else
      console.log 'Error connecting mongodb'

exports.process = (job, done) ->
  if not raw_data_collection
    connectMongo -> process(job, done)
  else
    process(job, done)

# get tags of musics the user likes
get_tags = (album_ids, callback) ->
  parallel_req_limit = 5
  async.mapLimit album_ids, parallel_req_limit, douban.music_tags, (err, results) ->
    tags = {}
    for result in results
      for tag in result
        tags[tag] = (tags[tag] or 0) + 1

    delete tags[tag] for tag, count of tags when count <= 1
      
    callback null, tags

process = (job, done) ->
  console.log job.data
  raw_data_collection.findOne id:job.data.id, (err, item) ->
    job.log 'processing %s(%s), who has %s liked songs', item.uid, item.id, item.liked_song_count

    album_ids = _.compact _.pluck item.songs, 'album_id'
    get_tags album_ids, (error, tags) ->
      console.log tags
      done()
