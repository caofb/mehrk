(function(Auth) {
	"use strict";

	var passport = require('passport'),
		passportLocal = require('passport-local').Strategy,
        validator = require('validator'),
        nconf=require('nconf'),
        UserOP = require('../models').UserOP,
        async=require('async'),
        winston=require('winston');
	function logout(req, res) {
		if (req.user && parseInt(req.user.uid, 10) > 0) {
			req.logout();
		}
		res.json(200);
	}

	function login(req, res, next) {
		passport.authenticate('local', function(err, userData, info) {
			if (err) {
				return next(err);
			}
			if (!userData) {
				return res.json(200,{code:403,errors:[{msg:info}]});
			}
			// Alter user cookie depending on passed-in option
			if (req.body.remember === 'true') {
				var duration = 1000*60*60*24*parseInt(nconf.get('loginDays' )|| 14, 10);
				req.session.cookie.maxAge = duration;
				req.session.cookie.expires = new Date(Date.now() + duration);
			} else {
				req.session.cookie.maxAge = false;
				req.session.cookie.expires = false;
			}

			req.login({
				uid: userData.uid
			}, function() {
				return res.json(200,{code:200});
			});
		})(req, res, next);
	}

	function register(req, res,next) {
		req.assert('username', '用户名不能为空！').notEmpty();
		req.assert('email', '邮箱不能为空！').notEmpty();
		req.assert('password', '密码不能为空！').notEmpty();
		req.assert('email', '请输入合法的邮箱！').isEmail();
		req.assert('username', '请输入合法的用户名！').isLength(3,20);
		req.assert('password', '请输入合法的密码！').isLength(6);
		req.assert('confirmPassword', '请输入正确的密码！').equals(req.body.password);
        var errors = req.validationErrors();
        if (errors) {
            winston.error(errors);
            return res.json(200,{code:403,errors:errors});
        }        
		var userData = {
			username: req.body.username,
			password: req.body.password,
			email: req.body.email,
		};
		async.parallel([
           function(callback){
              UserOP.getUserByUserName(userData.username,function(err,user){
    	        if(err) {
    		      return next(err);
    	        }
    	        if(user){
    	        	callback("用户名已被使用！");
    	        }
    	        else{
    	        	callback(null,'');
    	        }
              });
           },
           function(callback){
              UserOP.getUserByMail(userData.email,function(err,user){
    	        if(err) {
    		      return next(err);
    	        }
    	        if(user){
    	        	callback("邮箱已被使用！");
    	        }
    	        else{
    	        	callback(null,'');
    	        }
              });
           }
        ],
        function(err, results){
           if(err){
           	  return res.json(200,{code:403,errors:[{msg:err}]});
           }
           UserOP.newAndSave(userData,function(err,user, numberAffected){
        	if(err) {
        		return next(err);
        	}
        	req.login({
					uid: user.id
				}, function() {
					return res.json(200,{code:200});
			});
        	
           });
        });
        
		
	}

	Auth.initialize = function(app) {
		Auth.app = app;
		app.use(passport.initialize());
		app.use(passport.session());
	};

	Auth.createRoutes = function(app, middleware, controllers) {
		app.post('/logout',  middleware.prepareAPI, logout);
		app.post('/register',  middleware.prepareAPI, register);
		app.post('/login',  middleware.prepareAPI, function(req, res, next) {
			req.assert('username', '用户名或邮箱不能为空！').notEmpty();
			req.assert('password', '密码不能为空！').notEmpty();
			req.assert('username', '请输入合法的用户名！').isLength(3);
		    req.assert('password', '请输入合法的密码！').isLength(6);
            var errors = req.validationErrors();
            if (errors) {
            	winston.error(errors);
               return res.json(200,{code:403,errors:errors});
            }

			if (req.body.username && validator.isEmail(req.body.username)) {
				UserOP.getUserByMail(req.body.username, function(err, user) {
					if (err) {
						return next(err);
					}
					req.body.username = user ? user.username : req.body.username;
					login(req, res, next);
				});
			} else {
				login(req, res, next);
			}
		});
	};
    Auth.login = function(username, password, next) {
		UserOP.getUserByUserName(username, function(err, user) {
			if (err) {
				return next(err);
			}
			if(!user) {				
				return next(null,false,'用户不存在！');
			}
            user.comparePassword(password,function(err,isMatch){
            	if(err) {
            		return next(null,false,'用户名或密码错误！');
            	}
                next(null, {
							uid: user.id
						}, '登陆成功！');
            });
		});
	};
	passport.use(new passportLocal(Auth.login));

	passport.serializeUser(function(user, done) {
		done(null, user.uid);
	});

	passport.deserializeUser(function(uid, done) {
		done(null, {
			uid: uid
		});
	});
}(exports));
