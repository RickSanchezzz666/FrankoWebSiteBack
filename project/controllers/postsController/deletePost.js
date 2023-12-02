const { ContentModel } = require('../../models/contentModel')

module.exports.deletePost = async (req, res) => {
    if (req.user.u_AccessLevel === 1 || req.user.u_AccessLevel === 0) {
        try {
            const { p_Id } = req.body;
            if (!p_Id) {
                return res.status(400).send({ message: "Parameter 'Post Id' is required." })
            }
            const post = await ContentModel.findOneAndDelete({ p_Id })

            if(!post) {
                return res.status(404).send({ message: "There are no entries with such 'Post ID'." })
            }
            return res.status(200).send({ message: "Post successfully deleted." });
        } catch (error) {
            res.status(500).send({ message: "Internal server error: ", error })
        }
    } else {
        return res.status(403).send('Your access level is not enough.');
    };
};