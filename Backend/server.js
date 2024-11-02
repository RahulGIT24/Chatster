// Imports
const express = require("express");
const dotenv = require("dotenv");
var cors = require("cors");
const connectDB = require("./config/db")
const path = require("path")
const app = express();
const axios  = require('axios')
const cron = require('node-cron')   

// Configuring port from .env file
dotenv.config()
const port = process.env.PORT;

// Connecting to DB
connectDB();

// Cors and JSON
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require("./routes/auth"))
app.use('/api/user', require("./routes/user"))
app.use('/api/chat', require("./routes/chat"))
app.use('/api/message', require("./routes/message"))

app.get("/health", (req, res) => {
    res.status(200).json({ message: "Health is Good" });
});

const checkHealth = async () => {
    try {
        const res = await axios.get(`${process.env.DOMAIN}/health`);
        console.log(res.data.message);
    } catch (error) {
        console.log(error);
    }
};

cron.schedule("*/5 * * * *", async () => {
    await checkHealth()
});

// -------------------------------- Deployment --------------------------------

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, "/frontend/build")))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    })
} else {
    app.get("/", (req, res) => {
        res.send("API Running Successfully")
    })
}

// -------------------------------- Deployment --------------------------------

// Server
const server = app.listen(port, console.log("Listening on port " + port));

// Socket io setup
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*"
    }
})

// Connecting to socket.io
io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    // When user connects
    socket.on('setup', (userData) => {
        socket.join(userData.id);
        socket.emit('connected');
    })

    // When user join chat room
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    })

    // When user type
    socket.on('typing', (room) => {
        socket.in(room).emit('typing')
    })

    // When user stop typing
    socket.on('stop typing', (room) => {
        socket.in(room).emit('stop typing')
    })

    // When user receive a new message
    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user.id == newMessageRecieved.sender._id) return;

            socket.in(user.id).emit("message recieved", newMessageRecieved);
        });

    })
})