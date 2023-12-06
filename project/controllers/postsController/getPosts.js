const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');

module.exports.getPosts = async (req, res) => {
    try {
        const dbQuery = {};
        const posts = await ContentModel.find(dbQuery).sort({ p_Timestamp: -1 });
        return res.status(200).send(posts);
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Internal server error" })
    };
};