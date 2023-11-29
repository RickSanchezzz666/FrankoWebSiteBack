const { ContentModel } = require('../../models/contentModel')

module.exports.createPost = async (req, res) => {
    try {
        let idCount = await ContentModel.countDocuments();
        const { p_Title, p_TextContent, p_ShortDescription, p_Photos } = req.body
        
        p_Timestamp = new Date().toLocaleString()

        const newPost = new ContentModel({p_Id: idCount + 1, p_Title, p_TextContent, p_ShortDescription, p_Photos, p_Timestamp})
        await newPost.save()
    } catch (error) {
        res.status(500).send({ message: "Internal server error: ", error })
    }
}