const { Router } = require('express');
const { PostsController } = require('../../controllers');
const { apiWrapper } = require('../apiWrapper/index')
const router = Router();

router.post("/createPost", apiWrapper(PostsController.createPost));

module.exports = { router };