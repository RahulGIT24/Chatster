const mongoose = require('mongoose'); // Importing mongoose
const { Schema } = mongoose;

// Defining user schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    actype:{
        type: String,
        required: true,
        default:"Public"
    },
    pic: {
        type: String,
        default: "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"
    },
});

const User = mongoose.model('User', UserSchema);
module.exports = User; // Exporting UserSchema as user, a mongoose model