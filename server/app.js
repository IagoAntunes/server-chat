const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const messages = [];
var onlines = [];
var allClients = [];

var users =[];

io.on('connection', (socket) => {
  allClients.push(socket);
  const username = socket.handshake.query.username;
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      user: socket.handshake.query.username,
    });
  }
  io.emit("users", users);
  socket.on('message', (data) => {
    const message = {
      msg: data['msg'],
      user: username,
      time: data['time'],
      color: data['color']
    }
    messages.push(message)
    io.emit('message', message)

  });
  socket.on('online',(data) => {
    onlines.push({user: data['user']});
    io.emit('online',onlines)
  })
  socket.on("private message", ({ content, to }) => {
    socket.to(to).emit("private message", {
      content,
      from: socket.id,
    });
  });
  socket.on('disconnect', function() {
    console.log('Got disconnect!');

    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);
  });
});

server.listen(4590, () => {
  console.log('listening on *:3000');
});