const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');

module.exports.deletePost = async (req, res) => {
    try {
        if (req.user.u_AccessLevel === 1 || req.user.u_AccessLevel === 0) {
            const { p_Id } = req.body;
            if (!p_Id) {
                return res.status(400).send({ message: "Parameter 'Post Id' is required." })
            }
            const post = await ContentModel.findOneAndDelete({ p_Id })

            if (!post) {
                return res.status(404).send({ message: "There are no entries with such 'Post ID'." })
            }
            await loggerModule(`Публікація з ID ${p_Id} видалена`, req.user.u_Login);
            return res.status(200).send({ message: "Post successfully deleted." });
        } else {
            await loggerModule(`Користувач ${req.user.u_Fullname} спробував видалити публікацію`, "Console");
            return res.status(403).send({ message: "Your access level is not enough."});
        };
    } catch (error) {
        await loggerModule(`Помилка сервера, ${error}`, "Console");
        res.status(500).send({ message: "Internal server error" })
    }
};