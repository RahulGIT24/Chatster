const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: String, 
    code: String, 
    expiryTime: Number
},{
    timestamps: true
}
)

const OTP = mongoose.model('OTP', otpSchema,'OTP');
module.exports = OTP; // Exporting OTP