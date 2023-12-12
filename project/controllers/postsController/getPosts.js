const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');

module.exports.getPosts = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!postId) {
            const posts = await ContentModel.find({}, {
                Title,
                ShortDescription,
                Timestamp,
                Photos: { $slice: 1 }
            }).sort({ Timestamp: -1 });
            return res.status(200).send(posts);
        }

        const post = await ContentModel.findById(postId);

        if (!post) {
            return res.status(404).send({ message: "Publication not found." });
        }

        return res.status(200).send(post);
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Internal server error." })
    };
};