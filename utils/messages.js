const moment = require("moment");

const formatMessage = (message, username = "") => {
  let user;
  if (username != "") {
    user = username;
  } else {
    user = message.username;
  }
  return {
    username: user,
    text: message.text,
    time: moment().format("h:mm a"),
  };
};

module.exports = formatMessage;
