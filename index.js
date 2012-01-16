var fs = require('fs')
  , express = require('express')
  , reed = require('reed')
  , jadevu = require('jadevu')
  , stylus = require('stylus');

console.log = require('logging').from(__filename);

var server = express.createServer();

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
  server.use(server.router);
  server.use(express.favicon(__dirname + '/public/favicon.png'));
});

server.get('/', function(req, res) {
  reed.all(function(e, posts) {
    var posts = posts.map(function(post) {
      post.metadata.body = post.htmlContent;
      return post.metadata;
    });
    
    res.render('index', {
        posts: posts
      , layout: !req.header('X-PJAX')
    });
  });
  
});

server.get('/:page', function(req, res, next) {
  var slug = req.param('page');
  reed.pages.get(slug, function(e, page, body) {
    if (e || !body) {
      return next();
    }
    
    page.body = body;
    res.render('page', {
        page: page
      , layout: !req.header('X-PJAX')
    });
  });
});

server.get('/:post', function(req, res, next) {
  var slug = req.param('post');
  reed.get(slug, function(e, post, body) {
    if (e || !body) {
      return res.send(404);
    }
    
    post.body = body;
    res.render('post', {
        post: post
      , layout: !req.header('X-PJAX')
    });
  });
});


reed.on('ready', function() {
  server.listen(8080);
  console.log('Server running on', 8080);
});

reed.on('pagesReady', function() {
  reed.open('./posts');
});
reed.pages.open('./pages');

