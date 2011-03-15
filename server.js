var express = require('express'),
    stylus = require('stylus'),
    log = require('logging').from(__filename),
    fs = require('fs');

Number.prototype.toPhone = function(){
  var str = this.toString();
  return str.substr(0,3) + '.' + str.substr(3,3) + '.' + str.substr(6,4);
}

var server = module.exports = express.createServer();

server.configure(function(){
  server.set('views', __dirname + '/views');
  server.use(express.methodOverride());
  server.use(server.router);
  server.use(stylus.middleware(__dirname + '/public'));
  server.use(express.static(__dirname + '/public'));
});

server.get('/', function(req, res){
  fs.readFile('resume.json', 'utf8', function(err, resume){
    res.render('index.jade', {
      locals: {
        title: 'Conner Petzold',
        subtitle: 'Web developer',
        nav: [
          { name: 'résumé', path: '/résumé' },
          // { name: 'projects', path: '/projects' },
          { name: 'github', path: 'github.com/', username: 'cpetzold' },
          { name: 'twitter', path: 'twitter.com/', username: 'cpetzold' },
          { name: 'linkedin', path: 'linkedin.com/in/', username: 'cpetzold' },
          { name: 'facebook', path: 'facebook.com/', username: 'conner' }
        ]
      }
    });
  });
});

server.get('/:resume.:format?', function(req, res, next){
  if (req.params.resume != 'résumé' && req.params.resume != 'resume') return next();
  fs.readFile('resume.json', 'utf8', function(err, resume){
    if (!err) {
      if (req.params.format == 'json') {
        res.send(resume, { 'Content-Type': 'application/json' });
      } else {
        res.render('resume.jade', {
          locals: {
            title: 'Conner Petzold - Résumé',
            resume: JSON.parse(resume)
          }
        });
      }
    }
  });
});

if (!module.parent) {
  var port = process.env.PORT || 8080;
  server.listen(port);
  log('listening on port', port);
}