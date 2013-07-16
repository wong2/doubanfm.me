(function() {
  var config, db, douban, jobs, kue, mongo, request, _;

  _ = require('underscore');

  request = require('request');

  mongo = require('mongoskin');

  kue = require('kue');

  douban = require('../lib/douban');

  config = require('../config');

  db = mongo.db(config.mongo.server);

  jobs = kue.createQueue();

  exports.index = function(req, res) {
    return res.render('index', {
      title: 'hello'
    });
  };

  exports.collect = function(req, res) {
    var data;

    data = JSON.parse(req.body.data);
    return douban.user_info(data.id, function(error, user_info) {
      console.log(user_info);
      if (error) {
        return res.json({
          error: 1,
          msg: 'can not fetch user info'
        });
      }
      _.extend(data, user_info);
      return db.collection('raw_data').update({
        id: data.id
      }, data, {
        w: 1,
        upsert: true
      }, function(err, result) {
        var job;

        if (err) {
          return res.json({
            error: 1,
            msg: 'can not insert data to mongodb'
          });
        }
        job = jobs.create('stats', {
          title: data.uid,
          id: data.id
        });
        job.attempts(5).save();
        return res.json({
          uid: data.uid
        });
      });
    });
  };

  exports.show = function(req, res) {
    var uid;

    uid = req.params.uid;
    return db.collection('raw_data').findOne({
      uid: uid
    }, function(err, item) {
      if (err) {
        return res.json({
          error: 1,
          msg: 'error find user'
        });
      }
      return res.json(item);
    });
  };

}).call(this);
