"use strict";

var usersController = require('./users'),
    staticController = require('./static'),
    accountsController = require('./accounts'),
    _=require('lodash'),
    UserOP=require('../models').UserOP;

var Controllers = {
	users: usersController,
	accounts: accountsController,
	static: staticController,
};

Controllers.home = function(req, res, next) {
    res.render('home', { title: 'mehrk' });
};
Controllers.showLogin = function(req, res, next) {
	var data = {};
	data.token = res.locals.csrf_token;
    data.title="登录";
    if (req.query.next) {
		data.previousUrl = req.query.next;
	}
	res.render('login', data);
};

Controllers.showRegister = function(req, res, next) {

	var data = {};

	data.token = res.locals.csrf_token;
    data.title="注册";

	res.render('register', data);
};
Controllers.head = function(req, res, next) {
	var data = {};
	data.csrf_token = res.locals.csrf_token;
    data.isLoggedIn = !!req.user;
	var uid = req.user ? req.user.uid: 0;
	if(uid){
		UserOP.getUserById(uid,function(err,user){
			if(err)  {
				return next(err);
			}
			data.user=_.pick(user,  ['username', 'avatar_url','id']);
			res.json(data);
		});
	}
	else{
		res.json(data);
	}	
};
module.exports = Controllers;