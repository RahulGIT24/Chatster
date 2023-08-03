const mongoose = require("mongoose")
const URL = "mongodb://localhost:27017/chatApp";

const connectDB = async()=>{
    try {
        const con = await mongoose.connect(URL);
        console.log("Database connected")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;