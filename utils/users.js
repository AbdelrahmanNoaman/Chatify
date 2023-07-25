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

function getWaitingUsers(roomId) {
  return db.execute(
    `SELECT * FROM USERS WHERE room_id='${roomId}' AND TYPE='WAITING'`
  );
}

function getTeamOneUsers(roomId) {
  return db.execute(
    `SELECT * FROM USERS WHERE room_id='${roomId}' AND TYPE='TEAMONE'`
  );
}

function getTeamTwoUsers(roomId) {
  return db.execute(
    `SELECT * FROM USERS WHERE room_id='${roomId}' AND TYPE='TEAMTWO'`
  );
}

function getReferee(roomId) {
  return db.execute(
    `SELECT * FROM USERS WHERE room_id='${roomId}' AND TYPE='REFEREE'`
  );
}

async function check_count(roomId, type) {
  let cnt = await db.execute(
    `SELECT COUNT(*) as cnt FROM USERS WHERE room_id='${roomId}' and type ='${type}'`
  );
  cnt = cnt[0][0]["cnt"];
  if (type === "REFEREE" && cnt === 1) {
    return false;
  } else if ((type === "TEAMONE" || type === "TEAMTWO") && cnt === 2) {
    return false;
  }
  return true;
}

async function updateUser(username, roomId, type) {
  const valid = await check_count(roomId, type);
  if (valid) {
    return db.execute(
      `UPDATE USERS SET type='${type}' WHERE username= '${username}' AND room_id='${roomId}'`
    );
  }
  return false;
}

module.exports = {
  userJoin,
  getCurrUser,
  getReferee,
  getTeamOneUsers,
  getTeamTwoUsers,
  getWaitingUsers,
  updateUser,
};
