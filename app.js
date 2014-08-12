var nconf=require('nconf'),
    winston=require('winston'),
    express = require('express');
var app = express();
var configFile = __dirname + '/config.json';

nconf.file({
        file: configFile
    });
if (app.get('env') === 'development'){
	winston.remove(winston.transports.Console);
    winston.add(winston.transports.Console, {
	  colorize: true,
	  level:'debug'
    });
}

winston.add(winston.transports.File, {
	filename: 'logs/error.log',
	level: 'warn'
});
var  middleware = require('./server/middleware');
    




middleware = middleware(app);



module.exports = app;
