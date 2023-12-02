const { UsersModel } = require('../../models/usersModel')

module.exports.getUsers = async (req, res) => {
    if (req.user.u_AccessLevel === 1) {
        try {
            const dbQuery = { u_AccessLevel: 0 };
            const users = await UsersModel.find(dbQuery);
            return res.status(200).send(users);
        } catch (err) {
            res.status(500).send({ message: "Internal server error: ", error })
        }
    } else {
        return res.status(403).send({ message: "Your access level is not enough." });
    };
};