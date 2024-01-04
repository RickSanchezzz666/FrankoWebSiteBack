const { UsersModel } = require('../../models/usersModel');
const { loggerModule } = require('../logger');
const mongoose = require('mongoose');

module.exports.deleteAdmin = async (req, res) => {
    try {
        if (req.user.AccessLevel === 1) {
            const { userId } = req.body;
            if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).send({ message: "Недійсний або відсутній ідентифікатор користувача" });
            }
            const userExist = await UsersModel.findById(userId);
            if (!userExist) {
                return res.status(404).send({ message: "Користувач з таким ідентифікатором не знайдений" })
            } else if (userExist.AccessLevel === 1) {
                return res.status(403).send({ message: "Ви не можете видалити цього користувача, зверніться до технічного адміністратора" });
            } else {
                const deletedUser = await UsersModel.findByIdAndDelete(userId);
                await loggerModule(`Користувач '${deletedUser.Fullname}' успішно видалений`, req.user.Login);
                return res.status(200).send({ message: `Користувач '${deletedUser.Fullname}' успішно видалений!` });
            }
        } else {
            await loggerModule(`Користувач ${req.user.Fullname} спробував видалити користувача`, "Console");
            return res.status(403).send({ message: "Ваш рівень доступу недостатній"});
        };
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })
    }
};