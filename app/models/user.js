var mongoose = require('mongoose');
var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');

var userSchema = new mongoose.Schema({
  username: {type: String, unique: true},
  password: String
});

userSchema.post('init', function(){
  hashPassword(this.password);
});

userSchema.methods.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    callback(isMatch);
  });
};
userSchema.methods.hashPassword = function(password){
  bcrypt.hash(password, null, null, function(err, hash){
    if(err){
      throw err;
    }
    this.password = hash;
  });
};

module.exports = mongoose.model('User', userSchema);