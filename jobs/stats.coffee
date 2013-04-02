mongo = require('mongodb').MongoClient

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

process = (job, done) ->
  console.log job.data
  raw_data_collection.findOne id:job.data.id, (err, item) ->
    job.log 'processing %s(%s), who has %s liked songs', item.uid, item.id, item.liked_song_count
    setTimeout done, 10*1000
