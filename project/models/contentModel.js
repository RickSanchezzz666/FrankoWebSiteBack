const { Schema, model } = require('mongoose');

const schema = new Schema({
    ukrainian: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        shortDescription: { type: String, required: true }
    },
    english: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        shortDescription: { type: String, required: true }
    },
    photos: [{ type: String, required: true }],
    timestamp: { type: Date, required: true }
});

const ContentModel = new model('contents', schema);

module.exports = { ContentModel };