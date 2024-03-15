const { Schema, model } = require('mongoose');

const schema = new Schema({
    name: { type: String, required: true },
    link: { type: String },
    logo: [{ type: String, required: true }]
});

const PartnersModel = new model('partners', schema);

module.exports = { PartnersModel };