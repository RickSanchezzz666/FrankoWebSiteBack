const { PartnersModel } = require('../../models/partnersModel');
const { loggerModule } = require('../../controllers/logger');
require('dotenv').config();

module.exports.addPartner = async (req, res) => {
    try {
        const logoURL = 'url'

        if (req.user.accessLevel === 0 || req.user.accessLevel === 1) {
            const { name, link } = req.body;
            if (!name) {
                return res.status(400).send({ message: "Будь ласка заповніть поле 'name'" });
            }

            const newPartner = new PartnersModel({
                name: name,
                link: link,
                logo: logoURL
            });

            const savedPartner = await newPartner.save();
            const partnerId = savedPartner._id;
            await loggerModule(`Партнерська організація з ID ${partnerId} додана`, req.user.login);
            res.status(200).send({ message: "Партнерська організація успішно додана!" });
        } else {
            await loggerModule(`Недостатньо прав: Користувач ${req.user.fullName} спробував додати партнерську організацію`, "Console");
            return res.status(403).send({ message: "Ваш рівень доступу недостатній" });
        }
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" });
    }
};