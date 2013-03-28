var request = require('request');
var _ = require('underscore');
var mongo = require('mongodb').MongoClient;

exports.index = function(req, res){
  res.render('index', { title: 'hello' });
};

exports.collect = function(req, res){
  var data = JSON.parse(req.body.data);
  request('https://api.douban.com/v2/user/' + data.id, function(error, response, body){
    var user_info = JSON.parse(body);
    if (user_info.code) {
      // error
      res.json({ error: 1, msg: 'can not fetch user info' });
      return;
    }
    _.extend(data, user_info);
    data.url = data.alt;
    delete data.alt;
    console.log(data);
    // store the data to mongodb
    mongo.connect('mongodb://localhost:27017/doubanfm', function(err, db){
      if (err) {
        res.json({ error:1, msg: 'can not connect to mongodb'});
        return;
      }
      var collection = db.collection('data');
      collection.insert(data, {w:1}, function(err, result){
        if (err) {
          res.json({ error:1, msg: 'can not insert data to mongodb'});
          return;
        }
        res.json({ uid: user_info.uid });
      });
    });
  });
};

exports.show = function(req, res){
  var uid = req.params.uid;
  res.json({'uid':uid});
};
