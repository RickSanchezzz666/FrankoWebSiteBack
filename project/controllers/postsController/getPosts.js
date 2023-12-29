const {
	ContentModel
} = require('../../models/contentModel');
const {
	loggerModule
} = require('../logger');
const mongoose = require('mongoose');

module.exports.getPosts = async (req, res) => {
	try {
		const {
			postId
		} = req.params;
		const {
			lang
		} = req.query;

		if (!postId) {
			const selector = lang === 'en' ? 'English' : 'Ukrainian';

			let posts = await ContentModel.find({}, {
				[selector]: {
					'Title': 1,
					'ShortDescription': 1
				},
				'Timestamp': 1,
				'Photos': {
					$slice: 1
				}
			}).sort({
				'Timestamp': -1
			});

			posts = posts.map(post => {
				const languageContent = post[selector];
				return {
					_id: post._id,
					Title: languageContent.Title,
					ShortDescription: languageContent.ShortDescription,
					Timestamp: post.Timestamp,
					Photos: post.Photos.length > 0 ? post.Photos[0].replace(/(\/upload\/)/, '$1t_min-amif/') : []
				};
			});

			if (posts.length > 0) {
				return res.status(200).send(posts);
			} else {
				return res.status(404).send({
					message: "There are no publications."
				});
			}
		} else if (mongoose.Types.ObjectId.isValid(postId)) {
			const post = await ContentModel.findById(postId);

			if (post) {
				const selector = lang === 'en' ? post.English : post.Ukrainian;

				const responsePost = {
					...selector,
					Timestamp: post.Timestamp,
					Photos: post.Photos,
				};

				return res.status(200).send(responsePost);
			} else {
				return res.status(404).send({
					message: "Publication not found."
				});
			}
		} else {
			return res.status(400).send({
				message: "Invalid publication ID."
			});
		}
	} catch (err) {
		await loggerModule(`Server error, ${err}`, "Console");
		res.status(500).send({
			message: "Internal server error."
		});
	}
};