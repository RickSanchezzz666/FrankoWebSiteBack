const { MuseumsModel } = require('../../models/museumsModel');
const { loggerModule } = require('../logger');
const mongoose = require('mongoose');

module.exports.getMuseums = async (req, res) => {
    try {
        const { museumId } = req.params;
        const { lang } = req.query;

        if (!museumId) {
            const selector = lang === 'en' ? 'english' : 'ukrainian';

            let museums = await MuseumsModel.find({}, {
                [selector]: { 'title': 1, 'workingHours': 1, 'workingDays': 1, 'address': 1},
                'phone': 1,
                'link': 1,
                'photo': { $slice: 1 }
            });
            
            museums = museums.map(museum => {
                const languageContent = museum[selector];
                return {
                    _id: museum._id,
                    title: languageContent.title,
                    workingHours: languageContent.workingHours,
                    workingDays: languageContent.workingDays,
                    address: languageContent.address,
                    phone: museum.phone,
                    link: museum.link,
                    photo: museum.photo
                };
            });

            if (museums.length > 0) {
                return res.status(200).send(museums);
            } else {
                return res.status(404).send({ message: "Не знайдено жодної інформації про партнерські музеї" });
            }
        } else if (mongoose.Types.ObjectId.isValid(museumId)) {
            const museum = await MuseumsModel.findById(museumId);

            if (museum) {
                const selector = lang === 'en' ? museum.english : museum.ukrainian;

                const responseMuseum = {
                    ...selector,
                    phone: museum.phone,
                    link: museum.link,
                    photo: museum.photo,
                };

                return res.status(200).send(responseMuseum);
            } else {
                return res.status(404).send({ message: "Музей з таким ID відсутній" });
            }
        } else {
            return res.status(400).send({ message: "Недійсний ідентифікатор музею" });
        }
    } catch (err) {
        await loggerModule(`Server error, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" });
    }
};