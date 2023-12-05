const { LogsModel } = require('../../models/logsModel');
const { loggerModule } = require('../logger');

module.exports.getLogs = async (req, res) => {
    try {
        if (req.user.u_AccessLevel === 1) {
            const { key } = req.body;
            const dbQuery = {};
            if (key !== process.env.LOGS_KEY) {
                dbQuery.log_ByUser = { $ne: 'Console' };
            }
            const logs = await LogsModel.find(dbQuery);
            return res.status(200).send(logs);
        } else {
            await loggerModule(`Користувач ${req.user.u_Fullname} спробував отримати сервер-лог`, "Console");
            return res.status(403).send({ message: "Your access level is not enough."});
        };
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Internal server error" })
    }
};