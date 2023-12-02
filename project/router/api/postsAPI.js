const { Router } = require('express');
const { PostsController } = require('../../controllers');
const { apiWrapper } = require('../apiWrapper/index');
const passport = require('passport');
const router = Router();

router.post("/admin/createPost",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(PostsController.createPost)
);
router.get("/getPosts", apiWrapper(PostsController.getPosts));

module.exports = { router };