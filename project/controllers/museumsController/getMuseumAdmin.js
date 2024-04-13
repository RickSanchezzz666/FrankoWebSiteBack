const { MuseumsModel } = require('../../models/museumsModel');
const { loggerModule } = require('../logger');
const mongoose = require('mongoose');

module.exports.getMuseumAdmin = async (req, res) => {
    try {
        if (req.user.accessLevel === 1 || req.user.accessLevel === 0) {
            const { museumId } = req.params;

            if (!museumId) {
                return res.status(400).send({ message: "Відсутній ідентифікатор музею" });
            } else {
                if (mongoose.Types.ObjectId.isValid(museumId)) {
                    const post = await MuseumsModel.findById(museumId);

                    if (post) {
                        return res.status(200).send(post);
                    } else {
                        return res.status(404).send({ message: "Музей з таким ID відсутній" });
                    }
                } else {
                    return res.status(400).send({ message: "Недійсний ідентифікатор музею" });
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