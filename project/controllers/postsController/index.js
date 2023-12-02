module.exports.PostsController = {
    ...require('./createPost'),
    ...require('./deletePost'),
    ...require('./getPosts')
}