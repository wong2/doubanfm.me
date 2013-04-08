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
  async.map album_ids, douban.music_tags, (err, results) ->
    tags = {}
    for result in results
      console.log result
      for tag in result.tags
        tag_title = tag.title
        tags[tag_title] = 0 if tag_title not of tags
        tags[tag_title] += tag.count
          
    callback null, tags

process = (job, done) ->
  console.log job.data
  raw_data_collection.findOne id:job.data.id, (err, item) ->
    job.log 'processing %s(%s), who has %s liked songs', item.uid, item.id, item.liked_song_count

    album_ids = _.pluck item.songs, 'album_id'
    album_ids = _.without album_ids, null # remove null ids
    get_tags album_ids, (error, tags) ->
      console.log tags
      done()
