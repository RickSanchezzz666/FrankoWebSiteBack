const { Router } = require('express');
const { UsersController } = require('../../controllers');
// const passport = require('passport');
const router = Router();

router.post("/login", UsersController.login);

module.exports = { router };