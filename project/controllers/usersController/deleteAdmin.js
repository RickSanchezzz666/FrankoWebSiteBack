const { UsersModel } = require('../../models/usersModel');
const { loggerModule } = require('../logger');

module.exports.deleteAdmin = async (req, res) => {
    try {
        if (req.user.u_AccessLevel === 1) {
            const { u_Id } = req.body;
            if (!u_Id) {
                return res.status(400).send({ message: "Parameter 'User Id' is required." })
            }
            const userExist = await UsersModel.findOne({ u_Id });
            if (!userExist) {
                return res.status(404).send({ message: "There are no entries with such 'User ID'." })
            } else if (userExist.u_AccessLevel === 1) {
                return res.status(403).send({ message: "You can't delete superuser. Please contact technical administrator." });
            } else {
                const deletedUser = await UsersModel.findOneAndDelete({ u_Id });
                await loggerModule(`Користувач '${deletedUser.u_Fullname}' успішно видалений`, req.user.u_Login);
                return res.status(200).send({ message: `User '${deletedUser.u_Fullname}' successfully deleted.` });
            }
        } else {
            await loggerModule(`Користувач ${req.user.u_Fullname} спробував видалити користувача`, "Console");
            return res.status(403).send({ message: "Your access level is not enough."});
        };
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Internal server error" })
    }
};