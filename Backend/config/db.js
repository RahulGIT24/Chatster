const mongoose = require("mongoose")
const dotenv = require("dotenv");
dotenv.config()
const URL = process.env.URL;

const connectDB = async()=>{
    try {
        const con = await mongoose.connect(URL);
        console.log("Database connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;