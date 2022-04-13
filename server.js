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


function distsq(a,b){
  return a.x*b.x+a.y*b.y;
}

io.on('connection', function(socket) {

  socket.on('n', function(pl) {
    players[socket.id] = pl;
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
  socket.on('give', function(item,user) {
    io.sockets.to(user).emit('g',item);
  });
  socket.on('atk', function(dmg,to,from) {
      io.sockets.to(to).emit('dmg',dmg,from);
  });
  socket.on('pt', function(to,from) {
      io.sockets.emit('c','\"'+players[from].name+'\"' + ' was defeated by \"' + players[to].name+'\"');
      io.sockets.to(to).emit('point');

  });
  socket.on('sw', function(from) {
      io.sockets.emit('swanim',from);
  });
  socket.on('u', function(data) {
    players[socket.id] = data;
  });
  socket.on('disconnect', function() {
    delete players[socket.id];
  });
});
setInterval(function() {
  openedchests = {};
  io.sockets.emit('chr', players);
  io.sockets.emit('c', "CHEST RESET");
}, 10*60*1000);

setInterval(function() {
  io.sockets.emit('s', players);
}, 1000 / 30);
