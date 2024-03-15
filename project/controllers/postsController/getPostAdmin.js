const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');
const mongoose = require('mongoose');

module.exports.getPostAdmin = async (req, res) => {
    try {
        if (req.user.accessLevel === 1 || req.user.accessLevel === 0) {
            const { postId } = req.params;

            if (!postId) {
                return res.status(400).send({ message: "Відсутній ідентифікатор публікації" });
            } else {
                if (mongoose.Types.ObjectId.isValid(postId)) {
                    const post = await ContentModel.findById(postId);

                    if (post) {
                        return res.status(200).send(post);
                    } else {
                        return res.status(404).send({ message: "Публікація з таким ID відсутня" });
                    }
                } else {
                    return res.status(400).send({ message: "Недійсний ідентифікатор публікації" });
                }
            }
        } else {
            return res.status(403).send({ message: "Ваш рівень доступу недостатній" });
        }
    } catch (err) {
        await loggerModule(`Server error, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" });
    }
};