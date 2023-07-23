const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const path = require("path");

const formatMessage = require("./utils/messages.js");
const {
  getCurrUser,
  userJoin,
  getRoomUsers,
  leaveChat,
} = require("./utils/users.js");
const { welcomeUser, leaveUser,updateUserStatus } = require("./services/users.js");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {

  socket.on("joinRoom", ({ username, roomId }) => {
    welcomeUser({ username, roomId }, socket);
  });

  socket.on("disconnect", () => {
    leaveUser(io, socket);
  });

  socket.on("updatePlayer",({username,roomId,type})=>{
    updateUserStatus(io,username,roomId,type);
  })

  // Getting the chat message
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage(msg));
  });
});

server.listen(process.env.DEV_PORT || 3000, () => {
  console.log(`Connected on port ${process.env.DEV_PORT}`);
});
