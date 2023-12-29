const {
	UsersModel
} = require('../../models/usersModel');
const {
	loggerModule
} = require('../logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.login = async (req, res) => {
	try {
		const {
			Login,
			Password
		} = req.body;
		if (!Login) {
			return res.status(400).send({
				message: 'Parameter login is required'
			});
		}

		if (!Password) {
			return res.status(400).send({
				message: 'Parameter password is required'
			});
		}

		const user = await UsersModel.findOne({
			Login
		});

		if (!user) {
			return res.status(400).send({
				message: 'We not found any user with combination'
			});
		}

		const passValidity = await bcrypt.compare(Password, user.Password)
		if (!passValidity) {
			await loggerModule('Невадала авторизація: хибний пароль', Login);
			return res.status(400).send({
				message: 'Password incorrect'
			});
		}

		const token = jwt.sign({
				_id: user._id,
				Login: user.Login
			},
			process.env.JWT_KEY, {
				expiresIn: process.env.JWT_EXPIRES_IN_HOURS * 60 * 60
			});

		await loggerModule('Користувач авторизувався', user.Login);
		res.status(200).send({
			token
		});
	} catch (err) {
		await loggerModule(`Помилка сервера, ${err}`, "Console");
		res.status(500).send({
			message: "Internal server error"
		})
	}
}