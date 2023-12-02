const { Router } = require('express');
const { UsersController } = require('../../controllers');
const { apiWrapper } = require('../apiWrapper/index')
const passport = require('passport');
const router = Router();

router.get("/admin/auth",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(UsersController.auth)
);
router.post("/login", apiWrapper(UsersController.login));
router.post("/admin/createAdmin",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(UsersController.createAdmin)
);

module.exports = { router };