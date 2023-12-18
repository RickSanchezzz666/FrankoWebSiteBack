const { UsersModel } = require('../../models/usersModel');
const { loggerModule } = require('../logger');
const mongoose = require('mongoose');

module.exports.deleteAdmin = async (req, res) => {
    try {
        if (req.user.AccessLevel === 1) {
            const { userId } = req.body;
            if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).send({ message: "Invalid or missing 'User Id'." });
            }
            const userExist = await UsersModel.findById(userId);
            if (!userExist) {
                return res.status(404).send({ message: "There are no entries with such 'User ID'." })
            } else if (user.AccessLevel === 1) {
                return res.status(403).send({ message: "You can't delete superuser. Please contact technical administrator." });
            } else {
                const deletedUser = await UsersModel.findByIdAndDelete(userId);
                await loggerModule(`Користувач '${deletedUser.Fullname}' успішно видалений`, req.user.Login);
                return res.status(200).send({ message: `User '${deletedUser.Fullname}' successfully deleted.` });
            }
        } else {
            await loggerModule(`Користувач ${req.user.Fullname} спробував видалити користувача`, "Console");
            return res.status(403).send({ message: "Your access level is not enough."});
        };
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Internal server error" })
    }
};