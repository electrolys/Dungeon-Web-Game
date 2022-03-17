// Dependencies.


var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');


var app = express();
var server = http.Server(app);
var io = socketIO(server);

var PORT = process.env.PORT || 5000;
app.set('port', PORT);
app.use('/static', express.static(__dirname + '/static'));




// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(PORT, function() {
  console.log(`Starting server on port ${PORT}`);
});

var players = {};

var openedchests = {};

io.on('connection', function(socket) {

  socket.on('n', function() {
    players[socket.id] = {
      pos:{'x':0,'y':0},hp:0,
    };
  });
  socket.on('chat', function(message) {
    io.sockets.emit('c',message);
  });
  socket.on('ch', function(chest,user) {
    if (!openedchests[chest.id]){
      openedchests[chest.id]=true;
      io.sockets.to(user).emit('chg',chest);
    }

  });
  socket.on('u', function(data) {
    players[socket.id] = data;
  });
  socket.on('disconnect', function() {
    delete players[socket.id];
  });
});

setInterval(function() {
  io.sockets.emit('s', players);
}, 1000 / 30);
