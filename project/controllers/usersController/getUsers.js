const { UsersModel } = require('../../models/usersModel');
const { loggerModule } = require('../logger');

module.exports.getUsers = async (req, res) => {
    try {
        if (req.user.AccessLevel === 1) {
            const dbQuery = { AccessLevel: 0 };
            const users = await UsersModel.find(dbQuery);
            return res.status(200).send(users);
        } else {
            await loggerModule(`Користувач ${req.user.Fullname} спробував отримати список користувачів`, "Console");
            return res.status(403).send({ message: "Ваш рівень доступу недостатній" });
        };
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })
    }
};