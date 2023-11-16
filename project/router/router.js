const { Router } = require('express')
const router = Router();

const UsersAPI = require('./api/usersAPI');

router.use(UsersAPI.router);


module.exports = { router };