var express = require('express');

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
  res.send({'coming':'soon'});
});

if (!module.parent) server.listen(8080);