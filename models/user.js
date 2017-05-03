var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var MongoClient = require('mongodb').MongoClient;
var db;

MongoClient.connect('mongodb://admin:password@ds111461.mlab.com:11461/project3', (err, database) => {
  if (err) return console.log(err);
  db = database;
});

var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  }
});

var User = module.exports = mongoose.model('User', UserSchema);


module.exports.getUserByUsername = function(username, callback){
  var query = {username : username};
  User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) throw err;
    callback(null, isMatch);
  });
}
