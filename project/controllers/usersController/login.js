const { UsersModel } = require('../../models/usersModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.login = async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login) {
            return res.status(400).send({
                message: 'Parameter login is required'
            });
        }

        if (!password) {
            return res.status(400).send({
                message: 'Parameter password is required'
            });
        }

        const user = await UsersModel.findOne({ u_Login: login });

        if (!user) {
            return res.status(400).send({
                message: 'We not found any user with combination'
            });
        }

        const passValidity = await bcrypt.compare(password, user.u_Password)
        if (!passValidity) {
            return res.status(400).send({
                message: 'Password incorrect'
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
                login: user.u_Login
            },
            process.env.JWT_KEY,
            { expiresIn: process.env.JWT_EXPIRES_IN_HOURS * 60 * 60 });

        res.status(200).send({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: 'Internal server error'
        });
    }
}