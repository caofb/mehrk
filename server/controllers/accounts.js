"use strict";

var  UserOP = require('../models').UserOP;
var _=require('lodash');
var accountsController = {};


accountsController.accountEdit = function(req, res, next) {
	var callerUID = req.user ?req.user.uid : 0;
    var data = {};
	UserOP.getUserById(callerUID,function(err,user){
			if(err)  {
				return next(err);
			}
			data=_.pick(user,  ['signature', 'website','location', 'avatar_url']);
			data.title="设置";
			data.token = res.locals.csrf_token;
			res.render('account/edit',data);
	});
	
};
accountsController.getAccount = function(req, res, next) {
	var id = req.params.id;
  var data = {};
  if(!id.match(/^[0-9a-fA-F]{24}$/))
  {
    if (res.locals.isAPI) {
           return res.json(404, 'not-found');
    } else {
           return res.redirect('404');
    }
  }
	UserOP.getUserById(id,function(err,user){
			if(err)  {
				return next(err);
			}
      if(!user)
      {
        if (res.locals.isAPI) {
           return res.json(404, 'not-found');
        } else {
           return res.redirect('404');
        }
      }
			data=_.pick(user,  ['username','signature', 'website','location', 'avatar_url']);
			data.title="用户";
			res.render('account/profile',data);
	});
};
accountsController.changePassowrd = function(req, res, next) {
	var callerUID = req.user ?req.user.uid : 0;
	req.assert('currentPassword', '请输入合法的当前密码！').isLength(6);
	req.assert('newPassword', '请输入合法的新密码！').isLength(6);
	req.assert('newConfirmPassword', '请输入合法的确认密码！').isLength(6).equals(req.body.newPassword);
    var errors = req.validationErrors();
    if (errors) {
        return res.json(200,{code:403,errors:errors});
    }
    UserOP.getUserById(callerUID, function (err, user) {
      if (err) {
        return next(err);
      }
      user.comparePassword(req.body.currentPassword,function(err,isMatch){
            if(err) {
            	return res.json(200,{code:403,errors:[{msg:"当前密码错误！"}]});
            }
            user.password = req.body.newPassword;
            user.save(function (err) {
               if (err) {
                 return next(err);
               }
              return res.json(200,{code:200});

            });
      });
      
    });
	
};

accountsController.changeProfile = function(req, res, next) {
	var callerUID = req.user ?req.user.uid : 0;
    UserOP.getUserById(callerUID, function (err, user) {
      if (err) {
        return next(err);
      }
      user.location = req.body.location;
      user.signature = req.body.signature;
      user.website = req.body.website;
      user.save(function (err) {
         if (err) {
              return next(err);
          }
          return res.json(200,{code:200});
      });
      
    });
	
};

module.exports = accountsController;
