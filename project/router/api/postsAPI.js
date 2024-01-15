const { Router } = require('express');
const { PostsController } = require('../../controllers');
const { apiWrapper } = require('../apiWrapper/index');
const passport = require('passport');
const router = Router();

router.get("/getPosts/:postId?", apiWrapper(PostsController.getPosts));
router.get("/admin/getPost/:postId?",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(PostsController.getPostAdmin)
);
router.post("/admin/createPost",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(PostsController.createPost)
);
router.delete("/admin/deletePost",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(PostsController.deletePost)
);
router.patch("/admin/editPost",
    passport.authenticate('jwt', { session: false }),
    apiWrapper(PostsController.editPost)
);

module.exports = { router };