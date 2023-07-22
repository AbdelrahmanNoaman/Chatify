const {
  getCurrUser,
  userJoin,
  leaveChat,
  getWaitingUsers,
  getTeamOneUsers,
  getReferee,
  getTeamTwoUsers,
  updateUser,
} = require("../utils/users.js");
const formatMessage = require("../utils/messages.js");


//----------------Welcoming
// Send this message to a single client
function sayWelcome(socket) {
  socket.emit(
    "message",
    formatMessage({ text: "Welcome to Chatify!" }, process.env.BOT_NAME)
  );
}

//Now we need to broadcast a message to everyone detecting that someone has joined the room
//It broadcasts the message to everyone except the one connected
function sayJoined(socket, username, roomId) {
  socket.broadcast
    .to(roomId)
    .emit(
      "message",
      formatMessage(
        { text: `${username} has joined the room` },
        process.env.BOT_NAME
      )
    );
}

//---------------------Leaving
function sayGoodBye(io, username, roomId) {
  //It broadcasts the message to everyone
  io.to(roomId).emit(
    "message",
    formatMessage(
      { text: `${username} has left the room` },
      process.env.BOT_NAME
    )
  );
}

//--------------Informing and updating
function waitedUsers(socket, roomId) {
  getWaitingUsers(roomId).then(([rows, fieldData]) => {
    console.log(rows.length, "waited users");
    for (let i = 0; i < rows.length; i++) {
      socket.to(rows[i].room_id).emit("waitedUsers", rows[i].username);
    }
  });
}

function teamOneUsers(socket, roomId) {
  getTeamOneUsers(roomId).then(([rows, fieldData]) => {
    console.log(rows.length, "TEAM ONE");
    for (let i = 0; i < rows.length; i++) {
      socket.to(rows[i].room_id).emit("teamOne", rows[i].username);
    }
  });
}

function teamTwoUsers(socket, roomId) {
  getTeamTwoUsers(roomId).then(([rows, fieldData]) => {
    console.log(rows.length, "TEAM TWO");
    for (let i = 0; i < rows.length; i++) {
      socket.to(rows[i].room_id).emit("teamTwo", rows[i].username);
    }
  });
}

function refereeUser(socket, roomId) {
  getReferee(roomId).then(([rows, fieldData]) => {
    console.log(rows.length, "REFEREE");

    for (let i = 0; i < rows.length; i++) {
      socket.to(rows[i].room_id).emit("referee", rows[i].username);
    }
  });
}

function informUsers(socket, roomId) {
  waitedUsers(socket, roomId);
  teamOneUsers(socket, roomId);
  teamTwoUsers(socket, roomId);
  refereeUser(socket, roomId);
}



//--------------- Main functions

function welcomeUser(userObject, socket) {
  const user = userJoin(socket.id, userObject.username, userObject.roomId);
  socket.join(user.roomId);
  sayWelcome(socket, process.env.BOT_NAME);
  sayJoined(socket, user.username, user.roomId);
  informUsers(socket, user.roomId);
}

function leaveUser(io, socket) {
  leaveChat(socket.id).then(([rows, fieldData]) => {
    sayGoodBye(io, rows[0].username, rows[0].room_id);
    informUsers(socket, rows[0].room_id);
  });
}

function updateUserStatus(socket, username, roomId, type) {
  updateUser(username, roomId, type).then(() => {
    console.log("tb eh");
    informUsers(socket, roomId);
  });
}

module.exports = {
  welcomeUser,
  leaveUser,
  updateUserStatus,
};
