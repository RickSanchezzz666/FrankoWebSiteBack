const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');
const multer = require('multer');
const path = require('path');

const isImage = (file) => {
    const allowedTypes = ['.jpeg', '.jpg', '.png'];
    const extension = path.extname(file.originalname).toLowerCase();
    return allowedTypes.includes(extension);
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        if (isImage(file)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"), false);
        }
    },
    limits: { fileSize: process.env.PHOTO_MAX_SIZE }
}).array('Photos', 10);

module.exports.createPost = (req, res) => {
    upload(req, res, async function(err) {
        if (req.files.length === 0) {
            await loggerModule(`UploadError: Користувач ${req.user.Fullname} спробував завантажити файли та отримав помилку: Please upload at least 1 photo.`, "Console");
            return res.status(400).send({ message: "Please upload at least 1 photo." });
        }
        if (err instanceof multer.MulterError || err) {
            let errorMessage = "Error in file upload.";
            if (err.code === "LIMIT_FILE_SIZE") {
                errorMessage = "File is too large (max 10MB).";
            } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
                errorMessage = "The maximum allowed number of photos to upload: 10.";
            } else if (err.message === "Invalid file type") {
                errorMessage = "Invalid file format.";
            }
            await loggerModule(`UploadError: Користувач ${req.user.Fullname} спробував завантажити файли та отримав помилку: ${errorMessage}`, "Console");
            return res.status(400).send({ message: errorMessage });
        }

        try {
            if (req.user.AccessLevel === 0 || req.user.AccessLevel === 1) {
                const { Title, Description, ShortDescription } = req.body;

                let photoURLs = req.files.map(file => `${process.env.UPLOADS_PATH}${file.filename}`);

                const newPost = new ContentModel({
                    Title, 
                    Description, 
                    ShortDescription, 
                    Photos: photoURLs,
                    Timestamp: new Date()
                });

                const savedPost = await newPost.save();
                const postId = savedPost._id;
                await loggerModule(`Публікація з ID ${postId} створена`, req.user.Login);
                res.status(200).send({ message: "Post successfully created." });
            } else {
                await loggerModule(`Користувач ${req.user.Fullname} спробував створити публікацію`, "Console");
                return res.status(403).send({ message: "Your access level is not enough." });
            }
        } catch (err) {
            await loggerModule(`Помилка сервера, ${err}`, "Console");
            res.status(500).send({ message: "Internal server error." });
        }
    });
};