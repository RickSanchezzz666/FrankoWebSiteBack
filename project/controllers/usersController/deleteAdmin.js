const { UsersModel } = require('../../models/usersModel')

module.exports.deleteAdmin = async (req, res) => {
    if (req.user.u_AccessLevel === 1) {
        try {
            const { u_Id } = req.body;
            if (!u_Id) {
                return res.status(400).send({ message: "Parameter 'User Id' is required." })
            }
            const user = await UsersModel.findOne({ u_Id });
            if (!user) {
                return res.status(404).send({ message: "There are no entries with such 'User ID'." })
            } if (user.u_AccessLevel === 1) {
                return res.status(403).send({ message: "You can't delete superuser. Please contact technical administrator." });
            } else {
                const deletedUser = await UsersModel.findOneAndDelete({ u_Id });
                return res.status(200).send({ message: `User '${deletedUser.u_Fullname}' successfully deleted.` });
            }
        } catch (error) {
            res.status(500).send({ message: "Internal server error: ", error })
        }
    } else {
        return res.status(403).send('Your access level is not enough.');
    };
};