var kue = require('kue');
var jobs = kue.createQueue();

var stats = require('./stats');

jobs.process('stats', stats.process);
