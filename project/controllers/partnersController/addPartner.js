const { PartnersModel } = require('../../models/partnersModel');
const { loggerModule } = require('../logger');
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
    limits: { fileSize: process.env.PARTNERS_LOGO_MAX_SIZE }
}).single('logo');

module.exports.addPartner = (req, res) => {
    upload(req, res, async function(err) {
        if (err instanceof multer.MulterError || err) {
            let errorMessage = "Помилка під час завантаження файлу";
            if (err.code === "LIMIT_FILE_SIZE") {
                errorMessage = "Файл надто великий (max 1MB)";
            } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
                errorMessage = "Максимально дозволена кількість фотографій для завантаження: 1";
            } else if (err.message === "Invalid file type") {
                errorMessage = "Недійсний формат файлу (дозволені: jpeg, jpg, png)";
            }
            await loggerModule(`UploadError: Користувач ${req.user.fullName} спробував завантажити файл та отримав помилку: ${errorMessage}`, "Console");
            return res.status(400).send({ message: errorMessage });
        }

        if (!req.file) {
            await loggerModule(`UploadError: Користувач ${req.user.fullName} спробував завантажити файл та отримав помилку: Завантажте принаймні 1 фото`, "Console");
            return res.status(400).send({ message: "Будь ласка завантажте принаймні 1 фото" });
        }

        try {
            const logoURL = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { 
                        resource_type: 'auto', 
                        transformation: ["partners-logo"]
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                ).end(req.file.buffer);
            });

            if (req.user.accessLevel === 0 || req.user.accessLevel === 1) {
                const { name, link } = req.body;
                if (!name) {
                    return res.status(400).send({ message: "Будь ласка заповніть поле 'name'" });
                }

                const newPartner = new PartnersModel({
                    name: name,
                    link: link,
                    logo: logoURL
                });

                const savedPartner = await newPartner.save();
                const partnerId = savedPartner._id;
                await loggerModule(`Партнерська організація з ID ${partnerId} додана`, req.user.login);
                res.status(200).send({ message: "Партнерська організація успішно додана!" });
            } else {
                await loggerModule(`Недостатньо прав: Користувач ${req.user.fullName} спробував додати партнерську організацію`, "Console");
                return res.status(403).send({ message: "Ваш рівень доступу недостатній" });
            }
        } catch (err) {
            await loggerModule(`Помилка сервера, ${err}`, "Console");
            res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" });
        }
    });
};