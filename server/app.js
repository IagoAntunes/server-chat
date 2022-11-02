const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const messages = []


io.on('connection', (socket) => {
  const username = socket.handshake.query.username
  socket.on('message', (data) => {
    const message = {
      msg: data['msg'],
      user: username,
      time: data['time'],
      color: data['color']
    }
    messages.push(message)
    io.emit('message', message)

  })
  socket.on('online',(data) => {
    
  })
});

server.listen(4590, () => {
  console.log('listening on *:3000');
});