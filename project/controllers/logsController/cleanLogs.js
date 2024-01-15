const { LogsModel } = require('../../models/logsModel');
const { loggerModule } = require('../logger');

module.exports.cleanLogs = async (req, res) => {
    try {
        const { key } = req.query;
        if (req.user.accessLevel === 1 && key === process.env.LOGS_KEY) {
            await LogsModel.deleteMany({});
            return res.status(200).send({ message: 'Серверні логи успішно видалені' });
        } else {
            await loggerModule(`Недостатньо прав: Користувач ${req.user.fullName} спробував видалити сервер-лог`, "Console");
            return res.status(403).send({ message: "Ваш рівень доступу недостатній"});
        };
    } catch (err) {
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })
    }
};