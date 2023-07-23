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
  console.log("ana ahu");
  return db.execute(`SELECT * FROM USERS WHERE socket_id = '${socket_id}'`);
}

// user leave chat
function leaveChat(socket_id) {
  getCurrUser(socket_id).then(([rows, fieldData]) => {
    console.log(rows);
    if (rows[0] === undefined) {
      return undefined;
    }
    db.execute(`DELETE FROM USERS WHERE socket_id = '${socket_id}'`);
    return rows[0];
  });
}

function getWaitingUsers(roomId) {
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

async function check_count(roomId, type) {
  const cnt = await db.execute(
    `SELECT COUNT(*) as cnt FROM USERS WHERE room_id='${roomId}' and type ='${type}'`
  );
  console.log("cnt is ",cnt[0][0]["cnt"]);
  if (type === "REFEREE" && cnt[0] === 1) {
    return false;
  } else if ((type === "TEAMONE" || type === "TEAMTWO") && cnt === 2) {
    return false;
  }
  return true;
}

async function updateUser(username, roomId, type) {
  const valid = await check_count(roomId, type);
  console.log("is it valid "+valid);
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
  leaveChat,
  getReferee,
  getTeamOneUsers,
  getTeamTwoUsers,
  getWaitingUsers,
  updateUser,
};
