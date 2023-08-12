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

app.listen(port, console.log("Listening on port " + port));