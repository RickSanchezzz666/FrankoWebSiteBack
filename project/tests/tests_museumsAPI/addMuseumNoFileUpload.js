const { MuseumsModel } = require('../../models/museumsModel');
const { loggerModule } = require('../../controllers/logger');
require('dotenv').config();

module.exports.addMuseum = async (req, res) => {
    try {
        const photoURL = "url";

        if (req.user.accessLevel === 0 || req.user.accessLevel === 1) {
            const { title, workingHours, workingDays, phone, address, link } = req.body;
            if (!title) {
                return res.status(400).send({ message: "Будь ласка заповніть поля позначені " * "!" });
            }

            const newMuseum = new MuseumsModel({
                title: title,
                workingHours: workingHours,
                workingDays: workingDays,
                phone: phone,
                address: address,
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