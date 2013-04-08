request = require 'request'
mongodb = require 'mongodb'
_ = require 'underscore'
kue = require 'kue'
douban = require '../lib/douban'

jobs = kue.createQueue()

mongo = mongodb.MongoClient
raw_data_collection = null

mongo.connect 'mongodb://localhost:27017/doubanfm', (err, db) ->
  if not err
    console.log 'Connected to mongodb'
    raw_data_collection = db.collection 'raw_data'
  else
    console.log 'Error connecting mongodb'

exports.index = (req, res) ->
  res.render 'index', title:'hello'

exports.collect = (req, res) ->
  data = JSON.parse req.body.data
  douban.user_info data.id, (error, user_info) ->
    console.log user_info
    if error
      return res.json error: 1, msg: 'can not fetch user info'

    _.extend data, user_info

    # store the raw data to mongodb
    raw_data_collection.update {id:data.id}, data, {w:1,upsert:true}, (err, result) ->
      if err
        return res.json error: 1, msg:'can not insert data to mongodb'

      # create a new job
      job = jobs.create 'stats', {
        title: data.uid
        id: data.id
      }
      job.attempts(5).save()

      res.json {
        uid: data.uid
      }

exports.show = (req, res) ->
  uid = req.params.uid
  raw_data_collection.findOne uid:uid, (err, item) ->
    if err
      return res.json error: 1, msg: 'error find user'
    res.json item

