const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');
const mongoose = require('mongoose');

module.exports.getPosts = async (req, res) => {
    try {
        const { postId } = req.params;
        const { lang } = req.query;

        if (!postId) {
            const selector = lang === 'en' ? 'english' : 'ukrainian';

            let posts = await ContentModel.find({}, {
                [selector]: { 'title': 1, 'shortDescription': 1 },
                'timestamp': 1,
                'photos': { $slice: 1 }
            }).sort({ 'Timestamp': -1 });
            
            posts = posts.map(post => {
                const languageContent = post[selector];
                return {
                    _id: post._id,
                    title: languageContent.title,
                    shortDescription: languageContent.shortDescription,
                    timestamp: post.timestamp,
                    photos: post.photos.length > 0 ? post.photos[0].replace(/(\/upload\/)/, '$1t_min-amif/') : []
                };
            });

            if (posts.length > 0) {
                return res.status(200).send(posts);
            } else {
                return res.status(404).send({ message: "Не знайдено жодної публікації" });
            }
        } else if (mongoose.Types.ObjectId.isValid(postId)) {
            const post = await ContentModel.findById(postId);

            if (post) {
                const selector = lang === 'en' ? post.english : post.ukrainian;

                const responsePost = {
                    ...selector,
                    timestamp: post.timestamp,
                    photos: post.photos,
                };

                return res.status(200).send(responsePost);
            } else {
                return res.status(404).send({ message: "Публікація з таким ID відсутня" });
            }
        } else {
            return res.status(400).send({ message: "Недійсний ідентифікатор публікації" });
        }
    } catch (err) {
        await loggerModule(`Server error, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" });
    }
};