var mongoose = require('mongoose');
var db = require('../config');
var crypto = require('crypto');

var linkSchema = new mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String, 
  visits: Number,
  createAt: { type: Date, default: Date.now }
});

linkSchema.pre('save', function(next){
  this.shasum();
  next();
});

linkSchema.methods.shasum = function(){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
};

module.exports = mongoose.model('Link', linkSchema);