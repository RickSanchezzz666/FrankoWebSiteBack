const {
	ContentModel
} = require('../../models/contentModel');
const {
	loggerModule
} = require('../logger');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

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

module.exports.editPost = (req, res) => {
	upload(req, res, async function(err) {
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
			const {
				postId,
				UkrTitle,
				UkrDescription,
				UkrShortDescription,
				EngTitle,
				EngDescription,
				EngShortDescription
			} = req.body;
			if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
				return res.status(400).send({
					message: "Invalid or missing 'Post Id'."
				});
			}

			const post = await ContentModel.findById(postId);
			if (!post) {
				return res.status(404).send({
					message: "Publication not found."
				});
			}

			let update = {
				Ukrainian: {
					...post.Ukrainian
				},
				English: {
					...post.English
				},
			};

			if (UkrTitle !== undefined) update.Ukrainian.Title = UkrTitle;
			if (UkrDescription !== undefined) update.Ukrainian.Description = UkrDescription;
			if (UkrShortDescription !== undefined) update.Ukrainian.ShortDescription = UkrShortDescription;
			if (EngTitle !== undefined) update.English.Title = EngTitle;
			if (EngDescription !== undefined) update.English.Description = EngDescription;
			if (EngShortDescription !== undefined) update.English.ShortDescription = EngShortDescription;

			let photoURLs = post.Photos;
			if (req.files && req.files.length > 0) {
				const deletePromises = post.Photos.map(photoUrl => {
					const publicId = photoUrl.split('/').pop().split('.')[0];
					return cloudinary.uploader.destroy(publicId);
				});

				await Promise.all(deletePromises);

				const uploads = req.files.map(file => {
					return new Promise((resolve, reject) => {
						cloudinary.uploader.upload_stream({
								resource_type: 'auto'
							},
							(error, result) => {
								if (error) reject(error);
								else resolve(result.secure_url);
							}
						).end(file.buffer);
					});
				});

				photoURLs = await Promise.all(uploads);
			}
			update.Photos = photoURLs;

			if (req.user.AccessLevel === 0 || req.user.AccessLevel === 1) {
				await ContentModel.findByIdAndUpdate(postId, update);

				await loggerModule(`Публікація з ID ${postId} оновлена`, req.user.Login);
				res.status(200).send({
					message: "Post successfully updated."
				});
			} else {
				await loggerModule(`Користувач ${req.user.Fullname} спробував оновити публікацію`, "Console");
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