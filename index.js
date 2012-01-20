var fs = require('fs')
  , express = require('express')
  , blog = require('blog')
  , moment = require('moment')
  , jadevu = require('jadevu')
  , stylus = require('stylus');

console.log = require('logging').from(__filename);

var server = express.createServer()
  , blog = blog.createBlog();

server.configure(function() {
  server.set('views', __dirname + '/views');
  server.set('view engine', 'jade');
  server.use(express.methodOverride());
  server.use(stylus.middleware({
      src: __dirname + '/styles'
    , dest: __dirname + '/public'
    , compile: function(str, path) {
        return stylus(str).set('filename', path);
      }
  }));
  server.use(express.static(__dirname + '/public'));
  server.use(express.favicon(__dirname + '/public/favicon.png'));
  server.use(server.router);
  
  server.helpers({
    moment: moment
  });
});

server.get('/', function(req, res) {
  blog.getPosts(function(e, posts) {
    res.render('index', {
        posts: posts
      , layout: !req.header('X-PJAX')
    });
  });
  
});

server.get('/:page', function(req, res, next) {
  var slug = req.param('page');
  blog.getPage(slug, function(e, page) {
    if (e || !page) {
      return res.send(404);
    }
    
    res.render('page', {
        page: page
      , layout: !req.header('X-PJAX')
    });
  });
});

server.get('/:date/:post', function(req, res, next) {
  var slug = req.param('post');
  blog.getPost(slug, function(e, post) {
    if (e || !post) {
      return res.send(404);
    }

    res.render('post', {
        post: post
      , layout: !req.header('X-PJAX')
    });
  });
});

server.listen(8080);
console.log('Server running on', 8080);
