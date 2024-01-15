const { UsersModel } = require('../../models/usersModel');
const { loggerModule } = require('../logger');
const bcrypt = require('bcrypt');

module.exports.createAdmin = async (req, res) => {
    try {
        if (req.user.accessLevel === 1) {
            const { login, password, fullName } = req.body;
            if (!login || !password || !fullName) {
                return res.status(400).send({ message: "Будь ласка заповніть всі поля" });
            }

            const existingUser = await UsersModel.findOne({ login });
            if (existingUser) {
                return res.status(409).send({ message: "Користувач з цим логіном вже існує" });
            }

            const salt = await bcrypt.genSalt(10)
            const encryptedpassword = await bcrypt.hash(password, salt)
            const newAdmin = new UsersModel({
                login,
                password: encryptedpassword,
                fullName,
                accessLevel: 0
            });

            const savedAdmin = await newAdmin.save();
            const newAdminId = savedAdmin._id;
            await loggerModule(`Новий адміністратор з ID ${newAdminId} був успішно створений`, req.user.login);
            return res.status(200).send({message: "Ви успішно створили нового адміністратора!"});
        } else {
            await loggerModule(`Недостатньо прав: Користувач ${req.user.fullName} спробував створити користувача`, "Console");
            return res.status(403).send({ message: "Ваш рівень доступу недостатній" });
        };
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })
    }
}