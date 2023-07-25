const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const addTeamOne = document.getElementById("add-team-one");
const addTeamTwo = document.getElementById("add-team-two");
const addReferee = document.getElementById("add-referee");
const addWaiting = document.getElementById("add-waiting");
//Get username and room from URL
const { username, roomId } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
//Defining the socket
const socket = io();

//Adding the room id to be able to copy it
const p = document.createElement("p");
p.innerHTML = `${roomId}`;
document.getElementById("room-name").appendChild(p);

// --------------------------------------------------------------------------------------
// Dealing with sockets

//join chatroom event, which must happen when you enter any room
socket.emit("joinRoom", { username, roomId });
//Informing that this user will start in the waiting list
socket.emit("updatePlayer", {
  username: username,
  roomId: roomId,
  type: "WAITING",
});

// Receiving the message from the server
socket.on("message", (message) => {
  //displaying the message
  outputMessage(message);
  //every time we get a message we want to scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
// Case of receiving an updated version of waited users
socket.on("waitedUsers", (users) => {
  outputNames(users, "waiting-users");
});
// Case of receiving an updated version of team one
socket.on("teamOne", (username) => {
  outputNames(username, "team-one");
});
// Case of receiving an updated version of team two
socket.on("teamTwo", (username) => {
  outputNames(username, "team-two");
});
// Case of receiving an updated version of referee
socket.on("referee", (username) => {
  outputNames(username, "referee");
});

// --------------------------------------------------------------------------------------
// Event Listeners

// Event of transforming a player from any type to team one
addTeamOne.addEventListener("click", function () {
  socket.emit("updatePlayer", {
    username: username,
    roomId: roomId,
    type: "TEAMONE",
  });
});
// Event of transforming a player from any type to team two
addTeamTwo.addEventListener("click", function () {
  socket.emit("updatePlayer", {
    username: username,
    roomId: roomId,
    type: "TEAMTWO",
  });
});
// Event of transforming a player from any type to referee
addReferee.addEventListener("click", function () {
  socket.emit("updatePlayer", {
    username: username,
    roomId: roomId,
    type: "REFEREE",
  });
});
// Event of transforming a player from any type to waiting
addWaiting.addEventListener("click", function () {
  socket.emit("updatePlayer", {
    username: username,
    roomId: roomId,
    type: "WAITING",
  });
});

// Event of Adding a message
document.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = {
    username: username,
    roomId: roomId,
  };
  // Getting the text of the message
  msg.text = e.target.elements.msg.value;
  // Sending the msg to the server
  socket.emit("chatMessage", msg);
  // Every time we get a message we want to clear the input field, and focus on it
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// --------------------------------------------------------------------------------------
// Helper Functions

// Adding the message to the client side
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
      <div class="message">
        <p class="meta">${message.username}<span> ${message.time}</span></p>
        <p class="text">${message.text}</p>
      </div>`;
  document.querySelector(".chat-messages").appendChild(div);
}

//Adding the name of users in waiting names
function outputNames(users, listName) {
  const element = document.getElementById(listName);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  for (let i = 0; i < users.length; i++) {
    const li = document.createElement("li");
    li.innerHTML = `${users[i].username}`;
    document.getElementById(listName).appendChild(li);
  }
}
