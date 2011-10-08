var fs = require('fs')
  , express = require('express')
  , io = require('socket.io')
  , stylus = require('stylus');

console.log = require('logging').from(__filename);

var server = express.createServer()
  , io = io.listen(server);

io.set('log level', 1);

server.configure(function(){
  server.set('views', __dirname + '/views');
  server.set('view engine', 'jade');
  server.use(express.methodOverride());
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

server.get('/', function(req, res) {
  res.render('index');
});

server.listen(8080);
