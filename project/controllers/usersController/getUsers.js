const { UsersModel } = require('../../models/usersModel');
const { loggerModule } = require('../logger');

module.exports.getUsers = async (req, res) => {
    try {
        if (req.user.u_AccessLevel === 1) {
            const dbQuery = { u_AccessLevel: 0 };
            const users = await UsersModel.find(dbQuery);
            return res.status(200).send(users);
        } else {
            await loggerModule(`Користувач ${req.user.u_Fullname} спробував отримати список користувачів`, "Console");
            return res.status(403).send({ message: "Your access level is not enough." });
        };
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Internal server error" })
    }
};