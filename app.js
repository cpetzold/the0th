var sys = require('sys'),
    ext = require('./lib/ext'),
    express = require('express'),
    mongoose = require('mongoose').Mongoose,
    models = require('./lib/models');

var app = module.exports = express.createServer();
var db = mongoose.connect('mongodb://localhost/the0th');

var User = db.model('User'),
    Post = db.model('Post');
    
// var u = new User({
//   'username':'cpetzold',
//   'password':'test',
//   'name':'conner petzold',
//   'email':'cpetzold@gmail.com',
//   'type':'admin'
// });
// 
// u.save(function(){
//   console.log('Conner was saved!');
// });

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(express.bodyDecoder());
    app.use(express.cookieDecoder());
    app.use(express.session());
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

/* Login.. to a snowman */
app.post('/login', function(req, res){  
  var u = req.body.username,
      p = req.body.password;
  
  User.authenticate(u, p, function(o){
    if (!o.error) {
      req.session.userid = o.id;
      res.send({'username': o.username}, 200);
    } else {
      res.send(o, 404);
    }
  });  
});

app.get('/', function(req, res){
  
  User.find({'id':req.session.userid}).first(function(user){
    console.log('user:', sys.inspect(user));
  });
  
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