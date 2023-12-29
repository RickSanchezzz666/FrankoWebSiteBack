const {
	LogsModel
} = require('../models/logsModel');

async function loggerModule(action, byUser) {
	const logEntry = new LogsModel({
		log_Action: action,
		log_ByUser: byUser,
		log_Timestamp: new Date()
	});

	await logEntry.save();
}

module.exports = {
	loggerModule
};