const { Schema, model } = require('mongoose');

const schema = new Schema({
    log_Action: { type: String, required: true },
    log_ByUser: { type: String, required: true },
    log_Timestamp: { type: Date, required: true }
});

const LogsModel = new model('logs', schema)

module.exports = { LogsModel };