const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');

module.exports.deletePost = async (req, res) => {
    try {
        if (req.user.AccessLevel === 1 || req.user.AccessLevel === 0) {
            const { _id } = req.body;
            if (!_id) {
                return res.status(400).send({ message: "Parameter 'Post Id' is required." })
            }
            const post = await ContentModel.findByIdAndDelete(_id)

            if (!post) {
                return res.status(404).send({ message: "There are no entries with such 'Post ID'." })
            }
            await loggerModule(`Публікація з ID ${_id} видалена`, req.user.Login);
            return res.status(200).send({ message: "Post successfully deleted." });
        } else {
            await loggerModule(`Користувач ${req.user.Fullname} спробував видалити публікацію`, "Console");
            return res.status(403).send({ message: "Your access level is not enough."});
        };
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Internal server error." })
    }
};