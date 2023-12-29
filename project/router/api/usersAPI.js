const {
	Router
} = require('express');
const {
	UsersController
} = require('../../controllers');
const {
	apiWrapper
} = require('../apiWrapper/index');
const passport = require('passport');
const router = Router();

router.get("/admin/auth",
	passport.authenticate('jwt', {
		session: false
	}),
	apiWrapper(UsersController.auth)
);
router.get("/admin/getUsers",
	passport.authenticate('jwt', {
		session: false
	}),
	apiWrapper(UsersController.getUsers)
);
router.post("/login", apiWrapper(UsersController.login));
router.post("/admin/createAdmin",
	passport.authenticate('jwt', {
		session: false
	}),
	apiWrapper(UsersController.createAdmin)
);
router.delete("/admin/deleteAdmin",
	passport.authenticate('jwt', {
		session: false
	}),
	apiWrapper(UsersController.deleteAdmin)
);

module.exports = {
	router
};