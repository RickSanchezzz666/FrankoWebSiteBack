const { ContentModel } = require('../../models/contentModel')

module.exports.createPost = async (req, res) => {
    if (req.user.u_AccessLevel === 0 | req.user.u_AccessLevel === 1)
        try {
            let idCount = await ContentModel.countDocuments();
            const { p_Title, p_TextContent, p_ShortDescription, p_Photos } = req.body
            
            p_Timestamp = new Date().toLocaleString()

            const newPost = new ContentModel({p_Id: idCount + 1, p_Title, p_TextContent, p_ShortDescription, p_Photos, p_Timestamp})
            await newPost.save()
        } catch (error) {
            res.status(500).send({ message: "Internal server error: ", error })
        }
    else {
        return res.status(403).send({ message: "Your access level is not enough." })
    };
}