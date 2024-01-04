const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');
const multer = require('multer');
const mime = require('mime-types');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

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
}).array('Photos', 10);

module.exports.createPost = (req, res) => {
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
            await loggerModule(`UploadError: Користувач ${req.user.Fullname} спробував завантажити файли та отримав помилку: ${errorMessage}`, "Console");
            return res.status(400).send({ message: errorMessage });
        }

        if (!req.files || req.files.length === 0) {
            await loggerModule(`UploadError: Користувач ${req.user.Fullname} спробував завантажити файли та отримав помилку: Завантажте принаймні 1 фото`, "Console");
            return res.status(400).send({ message: "Будь ласка завантажте принаймні 1 фото" });
        }

        try {
            const uploads = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { 
                            resource_type: 'auto',
                            transformation: ["default-amif"]
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    ).end(file.buffer);
                });
            });

            const photoURLs = await Promise.all(uploads);

            if (req.user.AccessLevel === 0 || req.user.AccessLevel === 1) {
                const { UkrTitle, UkrDescription, UkrShortDescription, EngTitle, EngDescription, EngShortDescription } = req.body;
                if (!UkrTitle || !UkrDescription || !UkrShortDescription || !EngTitle || !EngDescription || !EngShortDescription) {
                    return res.status(400).send({ message: "Будь ласка заповніть всі поля" });
                }

                const newPost = new ContentModel({
                    Ukrainian: {
                        Title: UkrTitle, 
                        Description: UkrDescription, 
                        ShortDescription: UkrShortDescription
                    },
                    English: {
                        Title: EngTitle, 
                        Description: EngDescription, 
                        ShortDescription: EngShortDescription
                    },
                    Photos: photoURLs,
                    Timestamp: new Date()
                });

                const savedPost = await newPost.save();
                const postId = savedPost._id;
                await loggerModule(`Публікація з ID ${postId} створена`, req.user.Login);
                res.status(200).send({ message: "Публікація успішно створена!" });
            } else {
                await loggerModule(`Користувач ${req.user.Fullname} спробував створити публікацію`, "Console");
                return res.status(403).send({ message: "Ваш рівень доступу недостатній" });
            }
        } catch (err) {
            await loggerModule(`Помилка сервера, ${err}`, "Console");
            res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" });
        }
    });
};