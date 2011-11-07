var fs = require('fs')
  , express = require('express')
  , mongoose = require('mongoose')
  , everyauth = require('everyauth')
  , io = require('socket.io')
  , config = require('./config')
  , utils = require('./utils')

var server = express.createServer()
  , db = mongoose.connect('mongodb://localhost/the0th')
  , io = io.listen(server)
  , User = require('./models/user')

everyauth.helpExpress(server);

server.set('db', db);
server.set('io', io);

config(server);

server.get('/', function(req, res) {
  console.log(req.loggedIn, req.user);
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

server.listen(8080);
