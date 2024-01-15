const { UsersModel } = require('../../models/usersModel');
const { loggerModule } = require('../logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.login = async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).send({ message: 'Будь ласка заповніть всі поля' });
        }

        const user = await UsersModel.findOne({ login });

        if (!user) {
            return res.status(400).send({ message: 'Хибний логін або пароль' });
        }

        const passValidity = await bcrypt.compare(password, user.password)
        if (!passValidity) {
            await loggerModule('Невадала авторизація: хибний пароль', login);
            return res.status(400).send({ message: 'Хибний логін або пароль' });
        }

        const token = jwt.sign(
            {
                _id: user._id,
                login: user.login
            },
            process.env.JWT_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN_HOURS * 60 * 60 });

        await loggerModule('Користувач авторизувався', user.login);
        res.status(200).send({ token });
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })
    }
}