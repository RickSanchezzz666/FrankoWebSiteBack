const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');

module.exports.editPost = async (req, res) => {
    try {
        if (req.user.AccessLevel === 1 || req.user.AccessLevel === 0) {
            const { _id } = req.body;

            if (!_id) {
                return res.status(400).send({ message: "Parameter 'id' is required." })
            }

            const updateFields = {};
            
            if (req.body.Title !== undefined) {
                updateFields.Title = req.body.Title;
            }

            if (req.body.Description !== undefined) {
                updateFields.Description = req.body.Description;
            }

            if (req.body.ShortDescription !== undefined) {
                updateFields.ShortDescription = req.body.ShortDescription;
            }

            if (req.body.Photos !== undefined) {
                updateFields.Photos = req.body.Photos;
            }

            const updatedPost = await ContentModel.findByIdAndUpdate(
                _id,
                updateFields,
                { new: true }
            );

            if (updatedPost) {
                await loggerModule(`Публікація з ID ${_id} успішно змінена`, req.user.Login);
                return res.status(200).send({ message: "Post successfully edited.", updatedPost });
            } else {
                return res.status(404).send({ message: "Post not found or not edited." });
            }
        } else {
            await loggerModule(`Користувач ${req.user.Login} спробував змінити публікацію`, "Console");
            return res.status(403).send({ message: "Your access level is not enough." });
        }
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Internal server error" });
    }
};
