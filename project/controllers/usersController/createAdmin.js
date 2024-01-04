const { UsersModel } = require('../../models/usersModel');
const { loggerModule } = require('../logger');
const bcrypt = require('bcrypt');

module.exports.createAdmin = async (req, res) => {
    try {
        if (req.user.AccessLevel === 1) {
            const { Login, Password, Fullname } = req.body;
            if (!Login || !Password || !Fullname) {
                return res.status(400).send({ message: "Будь ласка заповніть всі поля" });
            }

            const existingUser = await UsersModel.findOne({ Login: Login });
            if (existingUser) {
                return res.status(409).send({ message: "Користувач з цим логіном вже існує" });
            }

            const salt = await bcrypt.genSalt(10)
            const encryptedPassword = await bcrypt.hash(Password, salt)
            const newAdmin = new UsersModel({
                Login,
                Password: encryptedPassword,
                Fullname,
                AccessLevel: 0
            });

            const savedAdmin = await newAdmin.save();
            const newAdminId = savedAdmin._id;
            await loggerModule(`Новий адміністратор з ID ${newAdminId} був успішно створений`, req.user.Login);
            return res.status(200).send({message: "Ви успішно створили нового адміністратора!"});
        } else {
            await loggerModule(`Адміністратор ${req.user.Fullname} спробував створити користувача`, "Console");
            return res.status(403).send({ message: "Ваш рівень доступу недостатній" });
        };
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })
    }
}