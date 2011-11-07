var express = require('express')
  , everyauth = require('everyauth')

console.log = require('logging').from(__filename);
module.exports = function(server) {
  var io = server.set('io');

  everyauth.github
    .appId('2649cd986c96afdb69e1')
    .appSecret('cb76a2ef09dbcadbc3cc553113b491d81289baf2')
    .entryPath('/login')
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, githubUserMetadata) {
      console.log(session, githubUserMetadata);
      return githubUserMetadata;
    })
    .redirectPath('/');

  server.configure(function(){
    io.set('log level', 1);
    
    server.set('views', __dirname + '/views');
    server.set('view engine', 'jade');
    server.use(express.cookieParser());
    server.use(express.session({ secret: 'pwned' }));
    server.use(express.methodOverride());
    server.use(server.router);
    server.use(everyauth.middleware());
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
