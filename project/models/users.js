const { Schema, model } = require('mongoose');

const schema = new Schema({
    u_Id: { type: Number, required: true, unique: true },
    u_Login: { type: String, required: true, unique: true },
    u_Password: { type: String, required: true },
    u_Fullname: { type: String, required: true },
    u_AccessLevel: { type: Number, required: true }
});

const UsersModel = new model('users', schema)

module.exports = { UsersModel };