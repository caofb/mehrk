"use strict";
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./../routes');
var csurf = require('csurf');
var compress = require('compression');
var nconf=require('nconf');
var session = require('express-session');
var hbs = require('hbs');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
var session    = require('express-session');
var MongoStore = require('connect-mongo')(session);
var auth = require('./../routes/authentication');
var winston=require('winston');
var app;

var middleware = {};

function handleErrors(err, req, res, next) {
	// we may use properties of the error object
	// here and next(err) appropriately, or if
	// we possibly recovered from the error, simply next().
	  res.status(500);
    if (!res.locals.isAPI) {
      if (process.env.NODE_ENV === 'development') {
        winston.error(err.message + req.url);
      }
      res.redirect('/500');
    } else{
      if (process.env.NODE_ENV === 'development') {
        winston.error(err.message + req.url);
      }
      res.json({
        error: err.message
      });
    }
}

function catch404(req, res, next) {
    res.status(404);
    if (!res.locals.isAPI) {
      if (process.env.NODE_ENV === 'development') {
        winston.error('Route requested but not found: ' + req.url);
      }
      res.redirect('/404');
    } else{
      if (process.env.NODE_ENV === 'development') {
        winston.error('Route requested but not found: ' + req.url);
      }
      res.json({
        error: 'Not found'
      });
    }
}

module.exports = function(webserver) {
	  app=webserver;
	  middleware = require('./middleware')(app);
    
	  app.set('views', path.join(__dirname,'../', 'views'));

	  app.set('view engine', 'hbs');
    hbs.localsAsTemplateData(app);
    hbs.registerPartials( path.join(__dirname ,'../', 'views/partials'));
  
    app.use(flash());

    if (app.get('env') !== 'development') {
    	app.enable('view cache');
    }         
    else{
      app.use(logger('dev'));
    }   
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(expressValidator());

    app.use(cookieParser(nconf.get('session_secret')));
    app.use(compress());
    
    app.use(session({
      secret: nconf.get('session_secret'),
      store: new MongoStore({
       db: nconf.get('mongo:database')
      }),
      resave: true,
      saveUninitialized: true,      
    }));

    app.use(require('serve-favicon')(path.join(__dirname, '../../', 'public/favicon.ico')));

    app.use(csurf()); // todo, make this a conditional middleware
		
	  app.use(function (req, res, next) {
		  res.locals.csrf_token =req.csrfToken();
      res.locals.isDevelopment=(app.get('env') === 'development');//
		  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
		  res.setHeader('X-Powered-By', 'caofb');
		  next();
	  });
    app.use(middleware.processRender);

    auth.initialize(app);

	  routes(app,middleware);

	  app.use(express.static(path.join(__dirname, '../../', 'public'), {
		  maxAge: app.enabled('cache') ? 5184000000 : 0
	  }));

	  app.use(catch404);
	  app.use(handleErrors);

	  return middleware;
};
