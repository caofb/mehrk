"use strict";
var UserOP = require('../models').UserOP;
var _ = require('lodash');
var app,
	middleware = {};

middleware.authenticate = function(req, res, next) {
	if(!req.user) {
		if (res.locals.isAPI) {
			return res.json(403, 'not-allowed');
		} else {
			return res.redirect('403');
		}
	} else {
		next();
	}
};
middleware.redirectToAccountIfLoggedIn = function(req, res, next) {
	if (req.user) {
		UserOP.getUserById(req.user.uid,  function (err, user) {
			if (res.locals.isAPI) {
				return res.json(302, '/account/profile/' + user.id);
			} else {
				res.redirect('/account/profile/' + user.id);
			}
		});
	} else {
		next();
	}
};
//检查是否登录
middleware.checkIsLogin = function(req, res, next) {
	var callerUID = req.user ? req.user.uid : 0;

	if (!callerUID) {
		if (res.locals.isAPI) {
			return res.json(403, 'not-allowed');
		} else {
			return res.redirect('/login?next=' + req.url);
		}
	}

	next();
};
middleware.checkAccountPermissions = function(req, res, next) {
	// This middleware ensures that only the requested user and admins can pass
	var callerUID = req.user ? req.user.uid : 0;

	if (callerUID === 0) {
		return res.redirect('/login?next=' + req.url);
	}
	UserOP.getUserById(req.params.id, function (err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			if (res.locals.isAPI) {
				return res.json(404, 'not-found');
			} else {
				return res.redirect('404');
			}
		}

		if (user.id=== callerUID) {
			return next();
		}
	});
};
middleware.prepareAPI = function(req, res, next) {
	res.locals.isAPI = true;
	next();
};
middleware.buildHeader=function(req,res,next){
	res.locals.isLoggedIn = !!req.user;
	var uid = req.user ? req.user.uid: 0;
	if(uid){
		UserOP.getUserById(uid,function(err,user){
			if(err)  {
				return next(err);
			}
			res.locals.user=_.pick(user,  ['username', 'avatar_url','id']);
			next();
		});
	}
	else{
		next();
	}
	
};
middleware.processRender = function(req, res, next) {
	// res.render post-processing, modified from here: https://gist.github.com/mrlannigan/5051687
	var render = res.render;
	res.render = function(template, options, fn) {
		var self = this,
			req = this.req,
			app = req.app,
			defaultFn = function(err, str){
				if (err) {
					return req.next(err);
				}

				self.send(str);
			};

		options = options || {};

		if ('function' === typeof options) {
			fn = options;
			options = {};
		}

		if ('function' !== typeof fn) {
			fn = defaultFn;
		}

		if (res.locals.isAPI) {
			return res.json(options);
		}

		render.call(self, template, options, function(err, str) {
			fn(err, str);
		});
	};

	next();
};
module.exports = function(webserver) {
	app = webserver;
	middleware.admin = require('./admin')(webserver);

	return middleware;
};