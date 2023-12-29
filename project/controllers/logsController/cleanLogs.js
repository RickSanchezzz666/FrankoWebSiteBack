const {
	LogsModel
} = require('../../models/logsModel');
const {
	loggerModule
} = require('../logger');

module.exports.cleanLogs = async (req, res) => {
	try {
		const {
			key
		} = req.query;
		if (req.user.AccessLevel === 1 && key === process.env.LOGS_KEY) {
			await LogsModel.deleteMany({});
			return res.status(200).send({
				message: 'Done.'
			});
		} else {
			await loggerModule(`Користувач ${req.user.Fullname} спробував видалити сервер-лог`, "Console");
			return res.status(403).send({
				message: "Your access level is not enough."
			});
		};
	} catch (err) {
		res.status(500).send({
			message: "Internal server error."
		})
	}
};