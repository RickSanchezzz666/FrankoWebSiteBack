const { Schema, model } = require('mongoose');

const schema = new Schema({
    Ukrainian: {
        Title: { type: String, required: true },
        Description: { type: String, required: true },
        ShortDescription: { type: String, required: true }
    },
    English: {
        Title: { type: String, required: true },
        Description: { type: String, required: true },
        ShortDescription: { type: String, required: true }
    },
    Photos: [{ type: String, required: true }],
    Timestamp: { type: Date, required: true }
});

const ContentModel = new model('contents', schema);

module.exports = { ContentModel };