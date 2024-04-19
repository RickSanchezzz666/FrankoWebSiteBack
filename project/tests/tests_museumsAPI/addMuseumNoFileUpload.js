const { MuseumsModel } = require('../../models/museumsModel');
const { loggerModule } = require('../../controllers/logger');
require('dotenv').config();

module.exports.addMuseum = async (req, res) => {
    try {
        const photoURL = "URL"

        if (req.user.accessLevel === 0 || req.user.accessLevel === 1) {
            const { ukrTitle, ukrWorkingHours, ukrWorkingDays, ukrAddress, engTitle, engWorkingHours, engWorkingDays, engAddress, phone, link } = req.body;
            if (!ukrTitle || !engTitle) {
                return res.status(400).send({ message: "Будь ласка заповніть поля позначені " * "!" });
            }

            const newMuseum = new MuseumsModel({
                ukrainian: {
                    title: ukrTitle,
                    workingHours: ukrWorkingHours,
                    workingDays: ukrWorkingDays,
                    address: ukrAddress
                },
                english: {
                    title: engTitle,
                    workingHours: engWorkingHours,
                    workingDays: engWorkingDays,
                    address: engAddress
                },
                phone: phone,
                link: link,
                photo: photoURL
            });

            const savedMuseum = await newMuseum.save();
            const museumId = savedMuseum._id;
            await loggerModule(`Карточка музею з ID ${museumId} додана`, req.user.login);
            res.status(200).send({ message: "Карточка музею успішно додана!" });
        } else {
            await loggerModule(`Недостатньо прав: Користувач ${req.user.fullName} спробував додати карточку музею`, "Console");
            return res.status(403).send({ message: "Ваш рівень доступу недостатній" });
        }
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" });
    }
};