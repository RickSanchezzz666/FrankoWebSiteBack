const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../../controllers/logger');
const multer = require('multer');
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
}).array('photos', 10);

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
            await loggerModule(`UploadError: Користувач ${req.user.fullName} спробував завантажити файли та отримав помилку: ${errorMessage}`, "Console");
            return res.status(400).send({ message: errorMessage });
        }

        if (!req.files || req.files.length === 0) {
            await loggerModule(`UploadError: Користувач ${req.user.fullName} спробував завантажити файли та отримав помилку: Завантажте принаймні 1 фото`, "Console");
            return res.status(400).send({ message: "Будь ласка завантажте принаймні 1 фото" });
        }

        try {
            const uploads = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { 
                            resource_type: 'auto',
                            height: 600,
                            width: 600
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    ).end(file.buffer);
                });
            });

            const photoURLs = await Promise.all(uploads);

            if (req.user.accessLevel === 0 || req.user.accessLevel === 1) {
                const { ukrTitle, ukrDescription, ukrShortDescription, engTitle, engDescription, engShortDescription } = req.body;
                if (!ukrTitle || !ukrDescription || !ukrShortDescription || !engTitle || !engDescription || !engShortDescription) {
                    return res.status(400).send({ message: "Будь ласка заповніть всі поля" });
                }

                const newPost = new ContentModel({
                    ukrainian: {
                        title: ukrTitle, 
                        description: ukrDescription, 
                        shortDescription: ukrShortDescription
                    },
                    english: {
                        title: engTitle, 
                        description: engDescription, 
                        shortDescription: engShortDescription
                    },
                    photos: photoURLs,
                    timestamp: new Date()
                });

                const savedPost = await newPost.save();
                const postId = savedPost._id;
                await loggerModule(`Публікація з ID ${postId} створена`, req.user.login);
                res.status(200).send({ message: "Публікація успішно створена!" });
            } else {
                await loggerModule(`Недостатньо прав: Користувач ${req.user.fullName} спробував створити публікацію`, "Console");
                return res.status(403).send({ message: "Ваш рівень доступу недостатній" });
            }
        } catch (err) {
            await loggerModule(`Помилка сервера, ${err}`, "Console");
            res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" });
        }
    });
};