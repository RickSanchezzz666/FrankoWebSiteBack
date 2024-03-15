const { Schema, model } = require('mongoose');

const schema = new Schema({
    frontText: { type: String, required: true },
    rearText: { type: String, required: true },
    link: { type: String },
    photo: [{ type: String, required: true }]
});

const MuseumsModel = new model('museums', schema);

module.exports = { MuseumsModel };