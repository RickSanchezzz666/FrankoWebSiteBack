const { Router } = require('express')
const router = Router();

const UsersAPI = require('./api/usersAPI');
const PostsAPI = require('./api/postsAPI');
const PartnersAPI = require('./api/partnersAPI');
const MuseumsAPI = require('./api/museumsAPI');
const LogsAPI = require('./api/logsAPI');

router.use(UsersAPI.router);
router.use(PostsAPI.router);
router.use(PartnersAPI.router);
router.use(MuseumsAPI.router);
router.use(LogsAPI.router);

module.exports = { router };