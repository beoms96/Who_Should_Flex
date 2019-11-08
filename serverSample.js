var app = require('express')();
var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
var io = require('socket.io').listen(server);

server.listen(3001);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/simpleIndex.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});