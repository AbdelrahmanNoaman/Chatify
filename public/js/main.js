const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

//Get username and room from URL
const {username,roomId}= Qs.parse(location.search,{
  ignoreQueryPrefix: true
});

console.log(username,roomId)

const socket = io();

// Receiving the message from the server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  //Everytime we get a message we want to scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Adding a message
document.addEventListener("submit", (e) => {
  e.preventDefault();
  //Getting the text of the message
  const msg={
    username:username
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
