// DISABLED (api -> postsAPI.js)

const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
    }
});

const upload = multer({ storage: storage }).array('Photos', 10);

module.exports.editPost = async (req, res) => {
    try {
        if (req.user.AccessLevel === 1 || req.user.AccessLevel === 0) {
            const { postId } = req.body;

            if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).send({ message: "Invalid or missing 'Post Id'." });
            }

            const postToUpdate = await ContentModel.findById(postId);
            if (!postToUpdate) {
                return res.status(404).send({ message: "Post not found." });
            }

            upload(req, res, async function(err) {
                if (err) {
                    // Буде доповнено
                }

                const updateFields = { ...req.body };

                if (req.files) {
                    postToUpdate.Photos.forEach(photo => {
                        const filename = path.basename(photo);
                        fs.unlinkSync(path.join('uploads', filename));
                    });

                    updateFields.Photos = req.files.map(file => `${process.env.UPLOADS_PATH}${file.filename}`);
                }

                const updatedPost = await ContentModel.findByIdAndUpdate(postId, updateFields, { new: true });
                await loggerModule(`Публікація з ID ${postId} успішно змінена`, req.user.Login);
                return res.status(200).send({ message: "Post successfully edited.", updatedPost });
            });
        } else {
            await loggerModule(`Користувач ${req.user.Login} спробував змінити публікацію`, "Console");
            return res.status(403).send({ message: "Your access level is not enough." });
        }
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Internal server error." });
    }
};