var express = require('express'),
    fs = require('fs');

var server = module.exports = express.createServer();

server.configure(function(){
  server.set('views', __dirname + '/views');
  server.use(express.methodOverride());
  server.use(server.router);
  server.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  server.use(express.staticProvider(__dirname + '/public'));
});

server.get('/', function(req, res){
  res.render('index.jade', {
    locals: {
      title: 'Conner Petzold',
      subtitle: 'Web developer at Yahoo!'
    }
  });
});

server.get('/:resume', function(req, res, next){
  if (req.params.resume != 'résumé' && req.params.resume != 'resume') return next();
  fs.readFile('resume.json', 'utf8', function(err, resume){
    if (!err) res.send(resume, { 'Content-Type': 'application/json' });
  });
});

if (!module.parent) server.listen(process.env.PORT || 8080);