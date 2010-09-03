
/**
 * Module dependencies.
 */

var sys = require('sys'),
    express = require('express'),
    connect = require('connect');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.set('views', __dirname + '/views');
    app.use(connect.bodyDecoder());
    app.use(connect.methodOverride());
    app.use(connect.compiler({ src: __dirname + '/public', enable: ['less'] }));
    app.use(app.router);
    app.use(connect.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(connect.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
   app.use(connect.errorHandler()); 
});

var sitename = 'the0th';

// Routes
app.get('/:page', function(req, res) {
  var pagename = decodeURIComponent(req.params.page);
  res.render('index.jade', {
    locals: {
      site: sitename,
      title: pagename,
      bodyid: (pagename == 'résumé') ? 'resume' : pagename
    }
  });
});

app.get('/', function(req, res){
  res.render('index.jade', {
    locals: {
      site: sitename,
      title: '',
      subtitle: '',
      bodyid: 'home'
    }
  });
});



if (!module.parent) app.listen(8000);
