const {
	UsersModel
} = require('../../models/usersModel');
const {
	loggerModule
} = require('../logger');
const bcrypt = require('bcrypt');

module.exports.createAdmin = async (req, res) => {
	try {
		if (req.user.AccessLevel === 1) {
			const {
				Login,
				Password,
				Fullname
			} = req.body;
			if (!Login || !Password || !Fullname) {
				return res.status(400).send({
					message: "All parameters 'Login', 'Password', and 'Fullname' are required."
				});
			}

			const existingUser = await UsersModel.findOne({
				Login: Login
			});
			if (existingUser) {
				return res.status(409).send({
					message: "User with this login already exists."
				});
			}

			const salt = await bcrypt.genSalt(10)
			const encryptedPassword = await bcrypt.hash(Password, salt)
			const newAdmin = new UsersModel({
				Login,
				Password: encryptedPassword,
				Fullname,
				AccessLevel: 0
			});

			const savedAdmin = await newAdmin.save();
			const newAdminId = savedAdmin._id;
			await loggerModule(`Новий адміністратор з ID ${newAdminId} був успішно створений`, req.user.Login);
			return res.status(200).send({
				message: "You successfully created an Admin!"
			});
		} else {
			await loggerModule(`Адміністратор ${req.user.Fullname} спробував створити користувача`, "Console");
			return res.status(403).send({
				message: "Your access level is not enough."
			});
		};
	} catch (err) {
		await loggerModule(`Помилка сервера, ${err}`, "Console");
		res.status(500).send({
			message: "Internal server error"
		})
	}
}