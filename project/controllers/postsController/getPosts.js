const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');
const mongoose = require('mongoose');

module.exports.getPosts = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            const posts = await ContentModel.find({}, {
                'Title': 1,
                'ShortDescription': 1,
                'Timestamp': 1,
                'Photos': { $slice: 1 }
            }).sort({ 'Timestamp': -1 });
            return res.status(200).send(posts);
        } else if (mongoose.Types.ObjectId.isValid(postId)) {
            const post = await ContentModel.findById(postId);
            if (!post) {
                return res.status(404).send({ message: "Publication not found." });
            }
            return res.status(200).send(post);
        } else {
            return res.status(404).send({ message: "Publication not found." });
        }
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Internal server error." });
    }
};