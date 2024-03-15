const { MuseumsModel } = require('../../models/museumsModel');
const { loggerModule } = require('../logger');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.deleteMuseum = async (req, res) => {
    try {
        if (req.user.accessLevel === 1 || req.user.accessLevel === 0) {
            const { museumId } = req.body;
            if (!museumId || !mongoose.Types.ObjectId.isValid(museumId)) {
                return res.status(400).send({ message: "Недійсний або відсутній ідентифікатор карточки музею" });
            }
            const museum = await MuseumsModel.findById(museumId);

            if (!museum) {
                return res.status(404).send({ message: "Відсутні записи із таким ідентифікатором карточки музею" });
            }

            const deletePromises = museum.photo.map(photoUrl => {
                const publicId = photoUrl.split('/').pop().split('.')[0];
                return cloudinary.uploader.destroy(publicId);
            });

            await Promise.all(deletePromises);

            await MuseumsModel.findByIdAndDelete(museumId);
            await loggerModule(`Карточка музею з ID ${museumId} видалена`, req.user.login);
            return res.status(200).send({ message: "Карточка музею видалена!" });
        } else {
            await loggerModule(`Недостатньо прав: Користувач ${req.user.fullName} спробував видалити карточку музею`, "Console");
            return res.status(403).send({ message: "Ваш рівень доступу недостатній" });
        }
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" });
    }
};