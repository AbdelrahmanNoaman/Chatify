const chatForm = document.getElementById("chat-form");

const socket = io();

// Receiving the message from the server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  //Everytime we get a message we want to scroll down
});

//Adding a message
chatForm = document.addEventListener("submit", (e) => {
  e.preventDefault();
  //Getting the text of the message
  const msg = e.target.elements.msg.value;
  //Sending the msg to the server
  socket.emit("chatMessage", msg);
});

//Adding the message to the client side
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
      <div class="message">
        <p class="meta">Brad <span>9:12pm</span></p>
        <p class="text">${message}</p>
      </div>`;
  document.querySelector(".chat-messages").appendChild(div);
}
