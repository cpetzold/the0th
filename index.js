var fs = require('fs')
  , express = require('express')
  , everyauth = require('everyauth')
  , io = require('socket.io')
  , stylus = require('stylus')
  , config = require('./config')
  , utils = require('./utils')

var server = express.createServer()

server.set('io', io.listen(server));
config(server);


server.get('/', function(req, res) {
  res.render('index');
});

var connections = 0;
io.sockets.on('connection', function(s) {
  connections++;
  io.sockets.emit('conn', { d: connections, b: utils.binary(connections) });
  s.on('disconnect', function() {
    connections--;
    io.sockets.emit('conn', { d: connections, b: utils.binary(connections) });
  });
});

//everyauth.helpExpress(server);
server.listen(8080);
