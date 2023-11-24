const { UsersModel } = require('../../models/usersModel')
const bcrypt = require('bcrypt')

module.exports.createAdmin = async (req, res) => {
    try {
        let idCount = await UsersModel.countDocuments();
        const { login, password, fullname } = req.body;
        const salt = await bcrypt.genSalt(10)
        const encryptedPassword = await bcrypt.hash(password, salt)
        
        const newAdmin = new UsersModel({ u_Id: idCount + 1, u_Login: login, u_Password: encryptedPassword, u_Fullname: fullname, u_AccessLevel: 1 });
        await newAdmin.save();
        return res.status(200).send({message: "You successfully created a Admin!"});
    } catch (error) {
        res.status(500).send({ message: "Internal server error: ", error })
    }
}