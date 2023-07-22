const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

//Get username and room from URL
const { username, roomId } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const p = document.createElement("p");
p.innerHTML = `${roomId}`;
document.getElementById("room-name").appendChild(p);

const socket = io();
const type = "WAITING";
//join chatroom
socket.emit("joinRoom", { username, roomId });
socket.emit("updatePlayer", { username, roomId, type });

// Receiving the message from the server
socket.on("message", (message) => {
  outputMessage(message);
  //every time we get a message we want to scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("waitedUsers", (username) => {
  console.log("ana ahu");
  console.log(username);
  outputNames(username, "waiting-users");
});

socket.on("teamOne", (username) => {
  outputNames(username, "team-one");
});

socket.on("teamTwo", (username) => {
  outputNames(username, "team-two");
});

socket.on("referee", (username) => {
  outputNames(username, "referee");
});

//Adding a message
document.addEventListener("submit", (e) => {
  e.preventDefault();
  //Getting the text of the message
  const msg = {
    username: username,
  };
  msg.text = e.target.elements.msg.value;
  //Sending the msg to the server
  socket.emit("chatMessage", msg);
  //Everytime we get a message we want to clear the input field
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Adding the message to the client side
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

//Adding the message to the client side
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
function outputNames(username, listName) {
  const li = document.createElement("li");
  li.innerHTML = `${username}`;
  document.querySelector(listName).appendChild(li);
}
