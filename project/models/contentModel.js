const { Schema, model } = require('mongoose');

const schema = new Schema({
    p_Id: { type: Number, required: true, unique: true },
    p_Title: { type: String, required: true },
    p_TextContent: { type: String, required: true },
    p_ShortDescription: { type: String, required: true },
    p_Photos: {
        p_Photo1: { type: Buffer, required: true },
        p_Photo2: { type: Buffer },
        p_Photo3: { type: Buffer },
        p_Photo4: { type: Buffer },
        p_Photo5: { type: Buffer },
        p_Photo6: { type: Buffer },
        p_Photo7: { type: Buffer },
        p_Photo8: { type: Buffer },
        p_Photo9: { type: Buffer },
        p_Photo10: { type: Buffer }
    },
    p_Timestamp: { type: Date, required: true }
});

const ContentModel = new model('contents', schema)

module.exports = { ContentModel };