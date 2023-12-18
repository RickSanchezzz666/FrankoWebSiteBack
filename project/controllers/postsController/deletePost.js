const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

module.exports.deletePost = async (req, res) => {
    try {
        if (req.user.AccessLevel === 1 || req.user.AccessLevel === 0) {
            const { postId } = req.body;
            if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).send({ message: "Invalid or missing 'Post Id'." });
            }
            const post = await ContentModel.findById(postId);

            if (!post) {
                return res.status(404).send({ message: "There are no entries with such 'Post ID'." });
            }

            post.Photos.forEach(photoUrl => {
                let filename = path.basename(photoUrl);
                fs.unlink(path.join('uploads', filename), err => {
                    if (err) console.error(err);
                });
            });

            await ContentModel.findByIdAndDelete(postId);
            await loggerModule(`Публікація з ID ${postId} видалена`, req.user.Login);
            return res.status(200).send({ message: "Post successfully deleted." });
        } else {
            await loggerModule(`Користувач ${req.user.Fullname} спробував видалити публікацію`, "Console");
            return res.status(403).send({ message: "Your access level is not enough." });
        }
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Internal server error." });
    }
};