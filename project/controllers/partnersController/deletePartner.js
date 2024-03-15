const { PartnersModel } = require('../../models/partnersModel');
const { loggerModule } = require('../logger');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.deletePartner = async (req, res) => {
    try {
        if (req.user.accessLevel === 1 || req.user.accessLevel === 0) {
            const { partnerId } = req.body;
            if (!partnerId || !mongoose.Types.ObjectId.isValid(partnerId)) {
                return res.status(400).send({ message: "Недійсний або відсутній ідентифікатор партнерської організації" });
            }
            const partner = await PartnersModel.findById(partnerId);

            if (!partner) {
                return res.status(404).send({ message: "Відсутні записи із таким ідентифікатором публікації" });
            }

            const deletePromises = partner.logo.map(photoUrl => {
                const publicId = photoUrl.split('/').pop().split('.')[0];
                return cloudinary.uploader.destroy(publicId);
            });

            await Promise.all(deletePromises);

            await PartnersModel.findByIdAndDelete(partnerId);
            await loggerModule(`Партнерська організація з ID ${partnerId} видалена`, req.user.login);
            return res.status(200).send({ message: "Партнерська організація видалена!" });
        } else {
            await loggerModule(`Недостатньо прав: Користувач ${req.user.fullName} спробував видалити партнерську організацію`, "Console");
            return res.status(403).send({ message: "Ваш рівень доступу недостатній" });
        }
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" });
    }
};