const sharp = require('sharp');
const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');

module.exports.createPost = async (req, res) => {
    try {
        if (req.user.AccessLevel === 0 || req.user.AccessLevel === 1) {
            const { Title, Description, ShortDescription, Photos } = req.body

            Timestamp = new Date();

            let photoBufferArray = [];

            for (let i = 1; i <= 10; i++) {
                const photoKey = `Photo${i}`;
                if (Photos && Photos[photoKey]) {
                    const photoBase64 = Photos[photoKey];

                    if (isBase64(photoBase64)) {
                        const photoBuffer = Buffer.from(photoBase64, 'base64');

                        if (photoBuffer.length > process.env.PHOTO_MAX_SIZE*1024*1024) {
                            return res.status(400).send({ message: `Photo ${photoKey} size exceeds the allowed limit (5 MB).` });
                        }

                        const { width, height } = await sharp(photoBuffer).metadata();
                        if (width > process.env.PHOTO_MAX_WIDTH || height > process.env.PHOTO_MAX_HEIGHT) {
                            return res.status(400).send({ message: `Photo ${photoKey} size exceeds the allowed limit.` });
                        }

                        const extension = await sharp(photoBuffer).toFormat();
                        if (!['jpeg', 'png', 'gif'].includes(extension.toLowerCase())) {
                            return res.status(400).send({ message: `Invalid extension for photo ${photoKey}. Allowed extensions: jpeg, png, gif.` });
                        }

                        photoBufferArray.push({ [photoKey]: photoBuffer });
                    }
                }
            }

            const newPost = new ContentModel({ Title, Description, ShortDescription, Photos: photoBufferArray, Timestamp })
            const savedPost = await newPost.save();
            const postId = savedPost._id;
            await loggerModule(`Публікація з ID ${postId} створена`, req.user.Login);
            res.status(200).send({ message: "Post succesfully created." })
        } else {
            await loggerModule(`Користувач ${req.user.Fullname} спробував створити публікацію`, "Console");
            return res.status(403).send({ message: "Your access level is not enough."});
        };
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Internal server error." })
    };
};

function isBase64(str) {
    try {
        return Buffer.from(str, 'base64').toString('base64') === str;
    } catch (err) {
        return false;
    }
};