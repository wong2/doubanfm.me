var kue = require('kue');
kue.app.set('title', 'doubanfm.me队列');
kue.app.listen(3001);
