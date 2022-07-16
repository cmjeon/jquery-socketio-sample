const express = require('express');
const http = require('http');
const app = express();
const path = require('path');
const server = http.createServer(app);
const socketIO = require('socket.io');

const io = socketIO(server);

app.use(express.static(path.join(__dirname, "src")));

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
  // console.log('connected...' + socket.id);
  let nickName;
  socket.on('nickname', (nickname) => {
    // console.log('### nickname', data)
    nickName = nickname;
    socket.emit('message', `${nickname} you are logged in !`);
    socket.broadcast.emit('message', `${nickname} just logged in!`);
  })

  socket.on('message', (data) => {
    io.emit('message', `${nickName} sent : ${data}`)
  })
})

server.listen(PORT, () => {
  console.log(`server is running ${PORT}`)
})