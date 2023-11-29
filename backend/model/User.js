const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true // Make email field unique
    },
    password: String,
    role: {
        type: String,
        default: "user", // Default role is "user"
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;