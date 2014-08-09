"use strict";
var mongoose = require('mongoose');
var nconf = require('nconf');
var connectUri='mongodb://'+ nconf.get('mongo:host') + ':' + nconf.get('mongo:port') + '/' + nconf.get('mongo:database');
if(nconf.get('mongo:username')&&nconf.get('mongo:password')){
	connectUri='mongodb://'+nconf.get('mongo:username')+":" +nconf.get('mongo:password')+"@" + nconf.get('mongo:host') + ':' + nconf.get('mongo:port') + '/' + nconf.get('mongo:database');
}
mongoose.connect(connectUri, function (err) {
  if (err) {
    console.error('connect to %s error: ',nconf.get('mongo:host'), err.message,connectUri);
    process.exit(1);
  }
});

// models
require('./user');


exports.User = mongoose.model('User');
exports.UserOP = require('./userOP');
