const { Router } = require('express');
const { PostsController } = require('../../controllers');
const { apiWrapper } = require('../apiWrapper/index');
const passport = require('passport');
const router = Router();

router.post("/createPost",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(PostsController.createPost)
);

module.exports = { router };