const { Router } = require('express')
const router = Router();

const UsersAPI = require('./api/usersAPI');
const PostsAPI = require('./api/postsAPI')

router.use(UsersAPI.router);
router.use(PostsAPI.router)


module.exports = { router };