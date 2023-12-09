const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');

module.exports.editPost = async (req, res) => {
    try {
        if (req.user.u_AccessLevel === 1 || req.user.u_AccessLevel === 0) {
            const { _id } = req.body;

            if (!_id) {
                return res.status(400).send({ message: "Parameter 'id' is required." })
            }

            const updateFields = {};
            
            if (req.body.p_Title !== undefined) {
                updateFields.p_Title = req.body.p_Title;
            }

            if (req.body.p_TextContent !== undefined) {
                updateFields.p_TextContent = req.body.p_TextContent;
            }

            if (req.body.p_ShortDescription !== undefined) {
                updateFields.p_ShortDescription = req.body.p_ShortDescription;
            }

            if (req.body.p_Photos !== undefined) {
                updateFields.p_Photos = req.body.p_Photos;
            }

            const updatedPost = await ContentModel.findByIdAndUpdate(
                _id,
                updateFields,
                { new: true }
            );

            if (updatedPost) {
                await loggerModule(`Публікація з ID ${_id} успішно змінена`, req.user.u_Login);
                return res.status(200).send({ message: "Post successfully edited.", updatedPost });
            } else {
                await loggerModule(`Публікація з ID ${_id} не змінена!`);
                return res.status(404).send({ message: "Post not found or not edited." });
            }
        } else {
            await loggerModule(`Користувач ${req.user.u_Fullname} спробував змінити публікацію`, "Console");
            return res.status(403).send({ message: "Your access level is not enough." });
        }
    } catch (error) {
        await loggerModule(`Помилка сервера, ${error}`, "Console");
        res.status(500).send({ message: "Internal server error" });
    }
};
