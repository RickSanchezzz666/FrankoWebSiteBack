const { Router } = require('express')
const router = Router();

const UsersAPI = require('./api/usersAPI');
const PostsAPI = require('./api/postsAPI');
const LogsAPI = require('./api/logsAPI');

router.use(UsersAPI.router);
router.use(PostsAPI.router);
router.use(LogsAPI.router);


module.exports = { router };