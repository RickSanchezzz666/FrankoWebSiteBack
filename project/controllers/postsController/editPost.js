const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            loggerModule(`File rejected: Invalid file type - ${file.mimetype}`, "Console");
            cb(new Error("Invalid file type"), false);
        }
    },
    limits: { fileSize: process.env.PHOTO_MAX_SIZE }
}).array('photos', 10);

module.exports.editPost = (req, res) => {
    upload(req, res, async function(err) {
        if (err instanceof multer.MulterError || err) {
            let errorMessage = "Помилка під час завантаження файлів";
            if (err.code === "LIMIT_FILE_SIZE") {
                errorMessage = "Файл надто великий (max 10MB)";
            } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
                errorMessage = "Максимально дозволена кількість фотографій для завантаження: 10";
            } else if (err.message === "Invalid file type") {
                errorMessage = "Недійсний формат файлу (дозволені: jpeg, jpg, png)";
            }
            await loggerModule(`UploadError: Користувач ${req.user.fullName} спробував завантажити файли та отримав помилку: ${errorMessage}`, "Console");
            return res.status(400).send({ message: errorMessage });
        }

        try {
            const { postId, ukrTitle, ukrDescription, ukrShortDescription, engTitle, engDescription, engShortDescription } = req.body;
            if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).send({ message: "Недійсний або відсутній ідентифікатор публікації" });
            }

            const post = await ContentModel.findById(postId);
            if (!post) {
                return res.status(404).send({ message: "Відсутні записи із таким ідентифікатором публікації" });
            }

            let update = {
                ukrainian: { ...post.ukrainian },
                english: { ...post.english },
            };

            if (ukrTitle !== undefined) update.ukrainian.title = ukrTitle;
            if (ukrDescription !== undefined) update.ukrainian.description = ukrDescription;
            if (ukrShortDescription !== undefined) update.ukrainian.shortDescription = ukrShortDescription;
            if (engTitle !== undefined) update.english.title = engTitle;
            if (engDescription !== undefined) update.english.description = engDescription;
            if (engShortDescription !== undefined) update.english.shortDescription = engShortDescription;

            let photoURLs = post.photos;
            if (req.files && req.files.length > 0) {
                const deletePromises = post.photos.map(photoUrl => {
                    const publicId = photoUrl.split('/').pop().split('.')[0];
                    return cloudinary.uploader.destroy(publicId);
                });

                await Promise.all(deletePromises);

                const uploads = req.files.map(file => {
                    return new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream({ resource_type: 'auto' },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result.secure_url);
                            }
                        ).end(file.buffer);
                    });
                });

                photoURLs = await Promise.all(uploads);
            }
            update.photos = photoURLs;

            if (req.user.accessLevel === 0 || req.user.accessLevel === 1) {
                await ContentModel.findByIdAndUpdate(postId, update);

                await loggerModule(`Публікація з ID ${postId} оновлена`, req.user.login);
                res.status(200).send({ message: "Публікація успішно оновлена!" });
            } else {
                await loggerModule(`Недостатньо прав: Користувач ${req.user.fullName} спробував оновити публікацію`, "Console");
                return res.status(403).send({ message: "Ваш рівень доступу недостатній" });
            }
        } catch (err) {
            await loggerModule(`Помилка сервера, ${err}`, "Console");
            res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" });
        }
    });
};