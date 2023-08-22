const User = require("../Models/Users.js");
// join a user to chat
function userJoin(socket_id, username, roomId) {
  const user = new User(username, roomId, socket_id);
  return user.CreateUser();
}

// get current user
function getCurrUser(socket_id) {
  return User.getUserBySocketId(socket_id);
}

function getWaitingUsers(roomId) {
  return User.getSpecificUsers(roomId, "WAITING");
}

function getTeamOneUsers(roomId) {
  return User.getSpecificUsers(roomId, "TEAMONE");
}

function getTeamTwoUsers(roomId) {
  return User.getSpecificUsers(roomId, "TEAMTWO");
}

function getReferee(roomId) {
  return User.getSpecificUsers(roomId, "REFEREE");
}

async function check_count(roomId, type) {
  let cnt = await User.getCnt(roomId, type);
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
    return User.updateUserType(username, roomId, type);
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
