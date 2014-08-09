"use strict";
var UserOP=require('../models').UserOP;
var usersController = {};

usersController.checkUserName = function(req, res, next) {
	var username=req.query.username;
    UserOP.getUserByUserName(username,function(err,user){
    	if(err) {
    		return next(err);
    	}
    	var result={isExist:user?true:false};
    	res.json(200, result);
    });
	
};
usersController.checkEmail = function(req, res, next) {
	var email=req.query.email;
    UserOP.getUserByMail(email,function(err,user){
    	if(err) {
    		return next(err);
    	}
    	var result={isExist:user?true:false};
    	res.json(200, result);
    });
};
module.exports = usersController;