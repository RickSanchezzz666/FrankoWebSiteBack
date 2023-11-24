const { Router } = require('express');
const { UsersController } = require('../../controllers');
const { apiWrapper } = require('../apiWrapper/index')
// const passport = require('passport');
const router = Router();

router.post("/login", apiWrapper(UsersController.login));
router.post("/createAdmin", apiWrapper(UsersController.createAdmin))

module.exports = { router };