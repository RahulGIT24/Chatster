// Imports
const express = require("express");
const dotenv = require("dotenv");
var cors = require("cors");
const connectDB = require("./config/db")

const app = express();
app.use(express.json())

// Configuring port from .env file
dotenv.config()
const port = process.env.PORT;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require("./routes/auth"))
app.use('/api/user', require("./routes/user"))
app.use('/api/chat', require("./routes/chat"))
app.use('/api/message', require("./routes/message"))

const server = app.listen(port, console.log("Listening on port " + port));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData.id);
        socket.emit('connected');
    })

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    })

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user.id == newMessageRecieved.sender._id) return;

            socket.in(user.id).emit("message recieved", newMessageRecieved);
        });

    })
})