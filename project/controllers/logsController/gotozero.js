const { LogsModel } = require('../../models/logsModel');
const { loggerModule } = require('../logger');

module.exports.gotozero = async (req, res) => {
    try {
        const { key } = req.body;
        if (req.user.u_AccessLevel === 1 && key === process.env.LOGS_KEY) {
            const gotozero = await LogsModel.deleteMany({});
            return res.status(200).send({ message: 'Done.' });
        } else {
            await loggerModule(`Користувач ${req.user.u_Fullname} спробував виадлити сервер-лог`, "Console");
            return res.status(403).send({ message: "Your access level is not enough."});
        };
    } catch (err) {
        res.status(500).send({ message: "Internal server error" })
    }
};