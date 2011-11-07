var express = require('express')
  , mongoose = require('mongoose')
  , everyauth = require('everyauth')
  , stylus = require('stylus')

console.log = require('logging').from(__filename);
module.exports = function(server) {
  var io = server.set('io')
    , db = server.set('db')
    , User = db.model('User')

  server.configure('development', function() {
    server.set('github', {
        token: '2649cd986c96afdb69e1'
      , secret: 'cb76a2ef09dbcadbc3cc553113b491d81289baf2'
    });
  });
  
  server.configure('production', function() {
    server.set('github', {
        token: '140aed9681b0c660a450'
      , secret: '659dce34810783373587e677749e4eb7a12162dd'
    });
  });

  server.configure(function(){
    everyauth.github
      .appId(server.set('github').token)
      .appSecret(server.set('github').secret)
      .findOrCreateUser(function(session, token, tokenExtras, ghUser) {
        var promise = this.Promise();
        User.findOrCreate(token, ghUser, function(e, user) {
          console.log(e, user);
          promise.fulfill(e || user);
        });
        return promise;
      })
      .redirectPath('/');

    io.set('log level', 1);
    
    server.set('views', __dirname + '/views');
    server.set('view engine', 'jade');
    server.use(express.cookieParser());
    server.use(express.session({ secret: 'pwned' }));
    server.use(express.methodOverride());
    server.use(everyauth.middleware());
    server.use(server.router);
    server.use(stylus.middleware({
        src: __dirname + '/styles'
      , dest: __dirname + '/public'
      , debug: true
      , compile: function(str, path) {
          return stylus(str).set('filename', path);
        }
    }));
    server.use(express.static(__dirname + '/public'));
    server.use(express.favicon(__dirname + '/public/favicon.png')); 
  });

};
