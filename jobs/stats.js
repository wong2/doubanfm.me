(function() {
  var async, config, db, douban, get_tags, mongo, _;

  mongo = require('mongoskin');

  async = require('async');

  _ = require('underscore');

  douban = require('../lib/douban');

  config = require('../config');

  db = mongo.db(config.mongo.server);

  get_tags = function(album_ids, callback) {
    var parallel_req_limit;

    parallel_req_limit = 5;
    return async.mapLimit(album_ids, parallel_req_limit, douban.music_tags, function(err, results) {
      var count, result, tag, tags, _i, _j, _len, _len1;

      tags = {};
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        result = results[_i];
        for (_j = 0, _len1 = result.length; _j < _len1; _j++) {
          tag = result[_j];
          tags[tag] = (tags[tag] || 0) + 1;
        }
      }
      console.log(tags, results);
      for (tag in tags) {
        count = tags[tag];
        if (count <= 1) {
          delete tags[tag];
        }
      }
      return callback(null, tags);
    });
  };

  exports.process = function(job, done) {
    console.log(job.data);
    return db.collection('raw_data').findOne({
      id: job.data.id
    }, function(err, item) {
      var album_ids;

      job.log('processing %s(%s), who has %s liked songs', item.uid, item.id, item.liked_song_count);
      album_ids = _.compact(_.pluck(item.songs, 'album_id'));
      return get_tags(album_ids, function(error, tags) {
        console.log(tags);
        return done();
      });
    });
  };

}).call(this);
