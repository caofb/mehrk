var nconf=require('nconf');
var configFile = __dirname + '/config.json';

nconf.file({
        file: configFile
    });
var express = require('express'),
    middleware = require('./server/middleware');
    
var app = express();



middleware = middleware(app);



module.exports = app;
