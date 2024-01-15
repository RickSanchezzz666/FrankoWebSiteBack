const { Schema, model } = require('mongoose');

const schema = new Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    accessLevel: { type: Number, required: true }
});

const UsersModel = new model('users', schema)

module.exports = { UsersModel };