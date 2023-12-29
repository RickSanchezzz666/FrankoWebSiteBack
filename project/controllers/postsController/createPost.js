const {
	ContentModel
} = require('../../models/contentModel');
const {
	loggerModule
} = require('../logger');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

const isImage = (file) => {
	const allowedTypes = ['.jpeg', '.jpg', '.png'];
	const extension = path.extname(file.originalname).toLowerCase();
	return allowedTypes.includes(extension);
};

const storage = multer.memoryStorage();

const upload = multer({
	storage: storage,
	fileFilter: function(req, file, cb) {
		if (isImage(file)) {
			cb(null, true);
		} else {
			cb(new Error("Invalid file type"), false);
		}
	},
	limits: {
		fileSize: process.env.PHOTO_MAX_SIZE
	}
}).array('Photos', 10);

module.exports.createPost = (req, res) => {
	upload(req, res, async function(err) {
		if (req.files.length === 0) {
			await loggerModule(`UploadError: Користувач ${req.user.Fullname} спробував завантажити файли та отримав помилку: Please upload at least 1 photo.`, "Console");
			return res.status(400).send({
				message: "Please upload at least 1 photo."
			});
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
			return res.status(400).send({
				message: errorMessage
			});
		}

		try {
			const uploads = req.files.map(file => {
				return new Promise((resolve, reject) => {
					cloudinary.uploader.upload_stream({
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
				const {
					UkrTitle,
					UkrDescription,
					UkrShortDescription,
					EngTitle,
					EngDescription,
					EngShortDescription
				} = req.body;
				if (!UkrTitle || !UkrDescription || !UkrShortDescription || !EngTitle || !EngDescription || !EngShortDescription) {
					return res.status(400).send({
						message: "All parameters are required."
					});
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
				res.status(200).send({
					message: "Post successfully created."
				});
			} else {
				await loggerModule(`Користувач ${req.user.Fullname} спробував створити публікацію`, "Console");
				return res.status(403).send({
					message: "Your access level is not enough."
				});
			}
		} catch (err) {
			await loggerModule(`Помилка сервера, ${err}`, "Console");
			res.status(500).send({
				message: "Internal server error."
			});
		}
	});
};