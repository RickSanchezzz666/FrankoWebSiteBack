const { PartnersModel } = require('../../models/partnersModel');
const { loggerModule } = require('../logger');

module.exports.getPartners = async (req, res) => {
    try {
        const partners = await PartnersModel.find();
        
        if (partners.length > 0) {
            return res.status(200).send(partners);
        } else {
            return res.status(404).send({ message: "Не знайдено жодної партнерської організації" });
        }
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })
    }
};