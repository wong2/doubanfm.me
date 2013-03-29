request = require 'request'
_ = require 'underscore'
mongo = require('mongodb').MongoClient

data_collection = null

mongo.connect 'mongodb://localhost:27017/doubanfm', (err, db) ->
  if not err
    console.log 'Connected to mongodb'
    data_collection = db.collection 'data'
  else
    console.log 'Error connecting mongodb'

exports.index = (req, res) ->
  res.render 'index', title:'hello'

exports.collect = (req, res) ->
  data = JSON.parse req.body.data
  request 'https://api.douban.com/v2/user/' + data.id, (error, response, body) ->
    user_info = JSON.parse body
    if user_info.code
      return res.json error: 1, msg: 'can not fetch user info'
    _.extend data, user_info
    data.url = data.alt
    delete data.alt
    console.log data
    # store the data to mongodb
    data_collection.insert data, w:1, (err, result) ->
      if err
        return res.json error: 1, msg:'can not insert data to mongodb'
      res.json uid:user_info.uid

exports.show = (req, res) ->
  uid = req.params.uid
  data_collection.findOne uid:uid, (err, item) ->
    if err
      return res.json error: 1, msg: 'error find user'
    res.json item

