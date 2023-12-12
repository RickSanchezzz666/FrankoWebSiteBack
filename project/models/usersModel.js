const { Schema, model } = require('mongoose');

const schema = new Schema({
    Login: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Fullname: { type: String, required: true },
    AccessLevel: { type: Number, required: true }
});

const UsersModel = new model('users', schema)

module.exports = { UsersModel };