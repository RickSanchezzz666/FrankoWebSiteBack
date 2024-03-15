const { MuseumsModel } = require('../../models/museumsModel');
const { loggerModule } = require('../logger');

module.exports.getMuseums = async (req, res) => {
    try {
        const museums = await MuseumsModel.find();
        
        if (museums.length > 0) {
            return res.status(200).send(museums);
        } else {
            return res.status(404).send({ message: "Не знайдено жодної карточки музею" });
        }
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })
    }
};