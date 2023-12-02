const { UsersModel } = require('../../models/usersModel')
const bcrypt = require('bcrypt')

module.exports.createAdmin = async (req, res) => {
    if (req.user.u_AccessLevel === 1) {
        try {
            let idCount = await UsersModel.countDocuments();
            const { login, password, fullname } = req.body;
            if (!login) {
                return res.status(400).send({ message: "Parameter 'login' is required." });
            } 
            if (!password) {
                return res.status(400).send({ message: "Parameter 'password' is required." });
            }
            if (!fullname) {
                return res.status(400).send({ message: "Parameter 'Fullname' is required." });
            }
            const existingUser = await UsersModel.findOne({ u_Login: login });
            if (existingUser) {
                return res.status(409).send({ message: "User with this login already exists." });
            }
            const salt = await bcrypt.genSalt(10)
            const encryptedPassword = await bcrypt.hash(password, salt)
            const newAdmin = new UsersModel({ u_Id: idCount + 1, u_Login: login, u_Password: encryptedPassword, u_Fullname: fullname, u_AccessLevel: 0 });
            await newAdmin.save();
            return res.status(200).send({message: "You successfully created an Admin!"});
        } catch (error) {
            res.status(500).send({ message: "Internal server error: ", error })
        }
    } else {
        return res.status(403).send({ message: "Your access level is not enough." });
    };
}