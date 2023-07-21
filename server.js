const express = require("express");
const http=require('http');


const dotenv = require("dotenv");
const path=require('path');
const socketio = require('socket.io');

const app = express();
const server=http.createServer(app);
const io = require('socket.io')(server)

dotenv.config();

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', socket =>{
  console.log('New WS Connection....');
  socket.emit('message','Welcome to Chatify');
})

server.listen(process.env.DEV_PORT || 3000, () => {
  console.log(`Connected on port ${process.env.DEV_PORT}`);
});
