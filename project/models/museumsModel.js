const { Schema, model } = require('mongoose');

const schema = new Schema({
    title: { type: String, required: true },
    workingHours: { type: String },
    workingDays: { type: String },
    phone: { type: String },
    address: { type: String },
    link: { type: String },
    photo: [{ type: String, required: true }]
});

const MuseumsModel = new model('museums', schema);

module.exports = { MuseumsModel };