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
    socket.emit('message', `[SYSTEM] ${nickname}, You are logged in !`);
    socket.broadcast.emit('message', `[SYSTEM] ${nickname} just logged in!`);
  })

  socket.on('message', (data) => {
    nickName = (nickName === undefined) ? 'UNKNOWN' : nickName
    io.emit('message', `[${nickName}] : ${data}`)
  })

  socket.on('count', (data) => {
    socket.emit('count', `[START]`)
    const reqCount = parseInt(data)
    let count = 0;
    var interval = setInterval(function() {
      if(count < reqCount) {
        const randomValue = Math.random()
        socket.emit('count', `${count+1} : ${randomValue}`)
      } else {
        clearInterval(interval);
        socket.emit('count', `[END]`)
      }
      count ++;
    }, 1000);
  })
})

server.listen(PORT, () => {
  console.log(`server is running ${PORT}`)
})