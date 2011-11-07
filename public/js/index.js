s = io.connect('http://localhost');
s.on('conn', function(data) {
  console.log('conn', data);
  document.title = data.b;
});
