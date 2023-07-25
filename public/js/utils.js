// --------------------------------------------------------------------------------------
// Helper Functions

// Adding the message to the client side
const outputMessage = function (message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
        <div class="message">
          <p class="meta">${message.username}<span> ${message.time}</span></p>
          <p class="text">${message.text}</p>
        </div>`;
  document.querySelector(".chat-messages").appendChild(div);
};

// Adding the name of users in any field
const outputNames = function (users, listName) {
  const element = document.getElementById(listName);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  for (let i = 0; i < users.length; i++) {
    const li = document.createElement("li");
    li.innerHTML = `${users[i].username}`;
    document.getElementById(listName).appendChild(li);
  }
};

module.exports = {
  outputMessage,
  outputNames,
};
