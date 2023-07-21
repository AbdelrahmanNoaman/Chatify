const express = require("express");
const http = require("http");

const dotenv = require("dotenv");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

dotenv.config();

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  //A single client
  socket.emit("message", "Welcome to Chatify");
  //Now we need to broadcast a message to everyone detecting that someone has joined the room
  //It broadcasts the message to everyone except the one connected
  socket.broadcast.emit("message", "A user has joined the chat");

  socket.on("disconnect", () => {
    //It broadcasts the message to everyone
    io.emit("message", "A user has left the chat");
  });

  // Getting the chat message
  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });
});

server.listen(process.env.DEV_PORT || 3000, () => {
  console.log(`Connected on port ${process.env.DEV_PORT}`);
});
