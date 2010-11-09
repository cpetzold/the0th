var sys = require('sys'),
    ext = require('ext'),
    express = require('express'),
    mongoose = require('mongoose').Mongoose,
    models = require('./lib/models');

var app = module.exports = express.createServer();
var db = mongoose.connect('mongodb://localhost/the0th');

var User = db.model('User'),
    Post = db.model('Post');
    
var u = new User({
  'username':'cpetzold',
  'password':'test'
  'name':'conner petzold',
  'email':'cpetzold@gmail.com',
  'type':'admin',
  
});
u.save(function(){
  console.log('Conner was saved!');
});

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(express.bodyDecoder());
    app.use(express.methodOverride());
    app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
    app.use(app.router);
    app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
   app.use(express.errorHandler()); 
});

var sitename = 'the0th';
var pages = ['résumé', 'resume', 'projects'];

app.get('/:page', function(req, res) {
  var pagename = decodeURIComponent(req.params.page);
  pagename = (pagename == 'résumé') ? 'resume' : pagename;
  res.render(pagename+'.jade', {
    locals: {
      site: sitename,
      title: pagename,
      bodyid: pagename
    }
  });
});

app.get('/', function(req, res){
  res.render('index.jade', {
    locals: {
      site: sitename,
      title: 'Blog',
      subtitle: 'Ohhhh yeah',
      bodyid: 'blog'
    }
  });
});

if (!module.parent) app.listen(8000);