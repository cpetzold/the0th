var fs = require('fs')
  , express = require('express')
  , owl = require('owl')
  , moment = require('moment')
  , jadevu = require('jadevu')
  , stylus = require('stylus')
  , nib = require('nib');

console.log = require('logging').from(__filename);

var server = module.exports = express.createServer()
  , blog = owl.createBlog()
  , resume = JSON.parse(fs.readFileSync('resume.json', 'utf8'));

server.configure(function() {
  server.set('port', 3000);
  server.set('views', __dirname + '/views');
  server.set('view engine', 'jade');
  server.use(express.methodOverride());
  server.use(express.bodyParser());
  server.use(stylus.middleware({
      src: __dirname + '/styles'
    , dest: __dirname + '/public'
    , compile: function(str, path) {
        return stylus(str).set('filename', path).use(nib());
      }
  }));
  server.use(express.static(__dirname + '/public'));
  server.use(express.favicon(__dirname + '/public/favicon.png'));
  server.use(server.router);
  
  server.helpers({
    moment: moment
  });
});

server.configure('production', function() {
  server.set('port', 80);
});

server.get('/', function(req, res) {
  blog.posts(function(e, posts) {
    res.render('index', {
        posts: posts
      , layout: !req.header('X-PJAX')
    });
  });
});

server.get('/:resume', function(req, res, next) {
  if (req.params.resume != 'résumé' && req.params.resume != 'resume') {
    return next();
  }

  res.send(resume);
});

server.get('/tag/:tag', function(req, res, next) {
  blog.posts({ tag: req.param('tag') }, function(e, posts) {
    res.render('index', {
        title: req.param('tag')
      , posts: posts
      , layout: !req.header('X-PJAX')
    });
  });
});

server.get('/:page', function(req, res, next) {
  blog.page(req.param('page'), function(e, page) {
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
  blog.post(req.param('post'), function(e, post) {
    if (e || !post) {
      return res.send(404);
    }
    
    res.render('post', {
        post: post
      , comments: true
      , layout: !req.header('X-PJAX')
    });
  });
});

server.post('/:post/comment', function(req, res, next) {
  blog.comment(req.param('post'), {
      name: req.param('name')
    , email: req.param('email')
    , md: req.param('body')
  }, function(e, comment, post) {
     res.redirect(req.header('referer') + '#comment-' + post.comments.length);
  });
});

blog.init(function() {
  server.listen(server.set('port'));
});
