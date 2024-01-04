const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.deletePost = async (req, res) => {
    try {
        if (req.user.AccessLevel === 1 || req.user.AccessLevel === 0) {
            const { postId } = req.body;
            if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).send({ message: "Недійсний або відсутній ідентифікатор публікації" });
            }
            const post = await ContentModel.findById(postId);

            if (!post) {
                return res.status(404).send({ message: "Відсутні записи із таким ідентифікатором публікації" });
            }

            const deletePromises = post.Photos.map(photoUrl => {
                const publicId = photoUrl.split('/').pop().split('.')[0];
                return cloudinary.uploader.destroy(publicId);
            });

            await Promise.all(deletePromises);

            await ContentModel.findByIdAndDelete(postId);
            await loggerModule(`Публікація з ID ${postId} видалена`, req.user.Login);
            return res.status(200).send({ message: "Публікація успішно видалена!" });
        } else {
            await loggerModule(`Користувач ${req.user.Fullname} спробував видалити публікацію`, "Console");
            return res.status(403).send({ message: "Ваш рівень доступу недостатній" });
        }
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" });
    }
};