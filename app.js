var sys = require('sys'),
    express = require('express'),
    mongoose = require('mongoose').Mongoose;

var app = module.exports = express.createServer();

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
      title: 'woot!',
      subtitle: '',
      bodyid: 'home'
    }
  });
});

if (!module.parent) app.listen(8000);