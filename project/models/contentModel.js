// INACTIVE

const { Schema, model } = require('mongoose');

const schema = new Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    ShortDescription: { type: String, required: true },
    Photos: [ 
        {Photo1: { type: Buffer, required: true }},
        {Photo2: { type: Buffer, default: null }},
        {Photo3: { type: Buffer, default: null }},
        {Photo4: { type: Buffer, default: null }},
        {Photo5: { type: Buffer, default: null }},
        {Photo6: { type: Buffer, default: null }},
        {Photo7: { type: Buffer, default: null }},
        {Photo8: { type: Buffer, default: null }},
        {Photo9: { type: Buffer, default: null }},
        {Photo10: { type: Buffer, default: null }}
    ],
    Timestamp: { type: Date, required: true }
});

const ContentModel = new model('contents', schema)

module.exports = { ContentModel };