const { ContentModel } = require('../../models/contentModel')

module.exports.getPosts = async (req, res) => {
    try {
        const dbQuery = {  };
        const posts = await ContentModel.find(dbQuery).sort({ p_Timestamp: -1 });
        return res.status(200).send(posts);
    } catch (err) {
        res.status(500).send({ message: "Internal server error: ", error })
    };
};