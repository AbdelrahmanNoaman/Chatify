const {
  getCurrUser,
  userJoin,
  getWaitingUsers,
  getTeamOneUsers,
  getReferee,
  getTeamTwoUsers,
  updateUser,
} = require("../utils/users.js");
const formatMessage = require("../utils/messages.js");
const db = require("../utils/database.js");

//----------------Welcoming
// Send this message to a single client
async function sayWelcome(socket) {
  socket.emit(
    "message",
    formatMessage({ text: "Welcome to Chatify!" }, process.env.BOT_NAME)
  );
}

//Now we need to broadcast a message to everyone detecting that someone has joined the room
//It broadcasts the message to everyone except the one connected
async function sayJoined(socket, username, roomId) {
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
function waitedUsers(io, roomId) {
  getWaitingUsers(roomId).then(([rows, fieldData]) => {
    io.to(roomId).emit("waitedUsers", rows);
  });
}

function teamOneUsers(io, roomId) {
  getTeamOneUsers(roomId).then(([rows, fieldData]) => {
    io.to(roomId).emit("teamOne", rows);
  });
}

function teamTwoUsers(io, roomId) {
  getTeamTwoUsers(roomId).then(([rows, fieldData]) => {
    io.to(roomId).emit("teamTwo", rows);
  });
}

function refereeUser(io, roomId) {
  getReferee(roomId).then(([rows, fieldData]) => {
    io.to(roomId).emit("referee", rows);
  });
}

async function informUsers(io, roomId) {
  await waitedUsers(io, roomId);
  await teamOneUsers(io, roomId);
  await teamTwoUsers(io, roomId);
  await refereeUser(io, roomId);
}

//--------------- Main functions

async function welcomeUser(userObject, socket) {
  const user = await userJoin(
    socket.id,
    userObject.username,
    userObject.roomId
  );
  console.log(user);
  socket.join(user.roomId);
  await sayWelcome(socket, process.env.BOT_NAME);
  await sayJoined(socket, user.username, user.roomId);
}

async function leaveUser(io, socket) {
  getCurrUser(socket.id).then(([rows, fieldList]) => {
    if (rows[0] === undefined) {
      console.log(`User isn't found`);
      return;
    }
    sayGoodBye(io, rows[0].username, rows[0].room_id);
    db.execute(
      `DELETE FROM USERS WHERE username='${rows[0].username}' AND room_id='${rows[0].room_id}'`
    ).then((status) => {
      if (status.affectedRows === 0) {
        return;
      }
      informUsers(io, rows[0].room_id);
    });
  });
}

function updateUserStatus(io, username, roomId, type) {
  updateUser(username, roomId, type).then((done) => {
    if (!done) {
      return;
    }
    informUsers(io, roomId);
  });
}

module.exports = {
  welcomeUser,
  leaveUser,
  updateUserStatus,
};
