const { LogsModel } = require('../../models/logsModel');
const { loggerModule } = require('../logger');

module.exports.getLogs = async (req, res) => {
    try {
        if (req.user.accessLevel === 1) {
            const { key } = req.query;
            const dbQuery = {};
            if (key !== process.env.LOGS_KEY) {
                dbQuery.log_ByUser = { $ne: 'Console' };
            }
            const logs = await LogsModel.find(dbQuery);
            return res.status(200).send(logs);
        } else {
            await loggerModule(`Недостатньо прав: Користувач ${req.user.fullName} спробував отримати сервер-лог`, "Console");
            return res.status(403).send({ message: "Ваш рівень доступу недостатній"});
        };
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })
    }
};