const { MuseumsModel } = require('../../models/museumsModel');
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
            loggerModule(`File rejected: Invalid file type - ${file.mimetype}`, "error");
            cb(new Error("Invalid file type"), false);
        }
    },
    limits: { fileSize: process.env.MUSEUM_PHOTO_MAX_SIZE }
}).single('photo');

module.exports.editMuseum = (req, res) => {
    upload(req, res, async function(err) {
        if (err) {
            let errorMessage = "Помилка під час завантаження файлів";
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    errorMessage = "Файл надто великий (max 10MB)";
                }
            } else if (err.message === "Invalid file type") {
                errorMessage = "Недійсний формат файлу (дозволені: jpeg, jpg, png)";
            }
            await loggerModule(`UploadError: Користувач ${req.user.fullName} спробував завантажити файл та отримав помилку: ${errorMessage}`, "error");
            return res.status(400).send({ message: errorMessage });
        }

        try {
            const { museumId, ukrTitle, ukrWorkingHours, ukrAddress, engTitle, engWorkingHours, engAddress, phone, email, link } = req.body;
            if (!museumId || !mongoose.Types.ObjectId.isValid(museumId)) {
                return res.status(400).send({ message: "Недійсний або відсутній ідентифікатор музею" });
            }

            const museum = await MuseumsModel.findById(museumId);
            if (!museum) {
                return res.status(404).send({ message: "Відсутні музеї з таким ідентифікатором" });
            }

            let update = {
                ukrainian: { ...museum.ukrainian },
                english: { ...museum.english },
            };

            if (ukrTitle !== undefined) update.ukrainian.title = ukrTitle;
            if (ukrWorkingHours !== undefined) update.ukrainian.workingHours = ukrWorkingHours;
            if (ukrAddress !== undefined) update.ukrainian.address = ukrAddress;
            if (engTitle !== undefined) update.english.title = engTitle;
            if (engWorkingHours !== undefined) update.english.workingHours = engWorkingHours;
            if (engAddress !== undefined) update.english.address = engAddress;
            if (phone !== undefined) update.phone = phone;
            if (email !== undefined) update.email = email;
            if (link !== undefined) update.link = link;

            if (req.file) {
                if (museum.photo && typeof museum.photo === 'string') {
                    const publicId = museum.photo.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                }

                const result = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream({ resource_type: 'image' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    ).end(req.file.buffer);
                });
                update.photo = result;
            }

            if (req.user.accessLevel === 0 || req.user.accessLevel === 1) {
                await MuseumsModel.findByIdAndUpdate(museumId, update);
                await loggerModule(`Музей з ID ${museumId} оновлений`, "info");
                res.status(200).send({ message: "Музей успішно оновлений!" });
            } else {
                await loggerModule(`Недостатньо прав: Користувач ${req.user.fullName} спробував оновити публікацію`, "error");
                return res.status(403).send({ message: "Ваш рівень доступу недостатній" });
            }
        } catch (err) {
            await loggerModule(`Помилка сервера, ${err}`, "error");
            res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" });
        }
    });
};