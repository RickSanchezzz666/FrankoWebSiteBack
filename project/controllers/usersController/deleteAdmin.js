const { UsersModel } = require('../../models/usersModel');
const { loggerModule } = require('../logger');

module.exports.deleteAdmin = async (req, res) => {
    try {
        if (req.user.AccessLevel === 1) {
            const { _id } = req.body;
            if (!_id) {
                return res.status(400).send({ message: "Parameter 'User Id' is required." })
            }
            const userExist = await UsersModel.findById(_id);
            if (!userExist) {
                return res.status(404).send({ message: "There are no entries with such 'User ID'." })
            } else if (user.AccessLevel === 1) {
                return res.status(403).send({ message: "You can't delete superuser. Please contact technical administrator." });
            } else {
                const deletedUser = await UsersModel.findByIdAndDelete(_id);
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