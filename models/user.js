var mongoose = require('mongoose')

var User = new mongoose.Schema({
    _token: { type: String, required: true, unique: true }
  , username: { type: String, required: true }
  , email: { type: String, required: true }
  , location: { type: String }
  , website: { type: String }
  , company: { type: String }
});

User.statics.findOrCreate = function(token, ghUser, fn) {
  var self = this;
  self.findOne({ _token: token }, function(e, user) {
    if (e) {
      return fn(e);
    } else if (user) {
      return fn(null, user);
    } else {
      self.create({
          _token: token
        , username: ghUser.login
        , email: ghUser.email
        , location: ghUser.location
        , website: ghUser.blog
        , company: ghUser.company
      }, fn);
    }
  });
};

module.exports = mongoose.model('User', User);
