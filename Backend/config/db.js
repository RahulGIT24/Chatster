// Imports
const mongoose = require("mongoose")
const dotenv = require("dotenv");
dotenv.config()

// DB URL from .env file
const URL = process.env.URL;

// Function to connect DB
const connectDB = async()=>{
    try {
        const con = await mongoose.connect(URL);
        console.log("Database connected")
    } catch (error) {
        console.log(error)
    }
}

// Exporting function
module.exports = connectDB;