let mongoose = require('mongoose');

let usersSchema = new mongoose.Schema({
    userID: {
        type: String,
        unique: true,
        required: true,
    },
    name: String,
    email: String,
    password: String,
    role: { type: String, enum: ['user', 'admin'] }
});


const Users = mongoose.model('users', usersSchema)

module.exports = Users;
