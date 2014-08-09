"use strict";
// models
var User = require('./index').User;
/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getUserByMail = function (email, callback) {
  if(!email){
  	callback(new Error('email can not be empty'));
  }
  User.findOne({email: email}, callback);
};
/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} username 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByUserName = function (username, callback) {
  if(!username){
  	callback(new Error('username can not be empty'));
  }
  User.findOne({'username': username}, callback);
};
/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
  User.findOne({_id: id}, callback);
};
/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function (query, opt, callback) {
  User.find(query, [], opt, callback);
};

exports.newAndSave = function (userDate, callback) {
  var user = new User();
  user.username = userDate.username;
  user.password = userDate.password;
  user.email = userDate.email;
  user.save(callback);
};
