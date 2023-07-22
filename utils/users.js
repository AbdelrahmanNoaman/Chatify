const db = require("../utils/database.js");
// join a user to chat
function userJoin(socket_id, username, roomId) {
  const user = { socket_id, username, roomId };
  db.execute(
    `INSERT INTO users
     VALUES ( '${user.username}' , '${user.roomId}' , 'WAITING' , '${user.socket_id}' )`
  );
  return user;
}

// get current user
function getCurrUser(socket_id) {
  return db.execute(`SELECT * FROM USERS WHERE socket_id = '${socket_id}'`);
}

// user leave chat
function leaveChat(socket_id) {
  const user = db.execute(
    `SELECT * FROM USERS WHERE socket_id = '${socket_id}'`
  );
  db.execute(`DELETE FROM USERS WHERE socket_id = '${socket_id}'`);
  return user;
}

function getWaitingUsers(roomId) {
  console.log(roomId);
  return db.execute(
    `SELECT * FROM USERS WHERE room_id='${roomId}' AND TYPE='WAITING'`
  );
}

function getTeamOneUsers(roomId) {
  return db.execute(
    `SELECT * FROM USERS WHERE room_id='${roomId}' AND TYPE='TEAM_ONE'`
  );
}

function getTeamTwoUsers(roomId) {
  return db.execute(
    `SELECT * FROM USERS WHERE room_id='${roomId}' AND TYPE='TEAM_TWO'`
  );
}

function getReferee(roomId) {
  return db.execute(
    `SELECT * FROM USERS WHERE room_id='${roomId}' AND TYPE='REFEREE'`
  );
}

function updateUser(username, roomId, type) {
  return db.execute(
    `UPDATE USERS SET type='${type}' WHERE username= '${username}' AND room_id='${roomId}'`
  );
}

module.exports = {
  userJoin,
  getCurrUser,
  leaveChat,
  getReferee,
  getTeamOneUsers,
  getTeamTwoUsers,
  getWaitingUsers,
  updateUser,
};
