const socket = io("http://localhost:8000");

const name = prompt("Enter your name to join"); //* Asking user's name

const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

var audio = new Audio("audio/sound.mp3"); //* Audio that will play on sending Messages
var audio2 = new Audio("audio/sound2.mp3"); //* Audio that will play on receiving Messages

//* If the form gets submitted, send server the message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "right") {
    audio.play();
  } else {
    setTimeout(() => {
      audio2.play();
    }, 1000);
  }
};

socket.emit("new-user-joined", name);

//* When new user join the chat
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "right");
});

//* When a sends the message, rceive it
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

//* When a user leaves the chat
socket.on("left", (name) => {
  append(`${name} left the chat`, "right");
});
