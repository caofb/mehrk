"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var nconf=require('nconf');
var UserSchema = new Schema({
  username: { type: String},
  password: { type: String },
  email: { type: String},
  profile_image_url: {type: String},
  is_block: {type: Boolean, default: false},
  location: { type: String },
  signature: { type: String },
  website: { type: String },

  create_at: { type: Date, default: Date.now },
  update_at: { type: Date, default: Date.now }

});
UserSchema.virtual('avatar_url').get(function () {
  var url = this.profile_image_url ||  nconf.get('site_static_host') + '/images/user_icon48.png';
  return url;
});
UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')){
    return next();
  } 
  user.password = md5(user.password);
  next();
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  if(md5(candidatePassword)===this.password){
     return cb(null, true);
  }
  else{
     return cb("密码不匹配",false);
  }
};
function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}
UserSchema.index({username: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});

mongoose.model('User', UserSchema);
