const axios = require('axios');
const { ContentModel } = require('../../models/contentModel')

module.exports.createPost = async (req, res) => {
    try {
        let idCount = await ContentModel.countDocuments();
        const { p_Title, p_TextContent, p_ShortDescription, p_Photos } = req.body
        
        p_Timestamp = new Date().toLocaleString()

        let photoBufferArray = [];

        if (Array.isArray(p_Photos)) {
            for (let i = 1; i <= 10; i++) {
                const photoKey = `p_Photo${i}`;
                const photoObject = p_Photos.find(photoObj => photoObj.hasOwnProperty(photoKey) && photoObj[photoKey] !== null);
                if (photoObject) {
                    const response = await axios.get(photoObject[photoKey], { responseType: 'arraybuffer' });
                    const photoBuffer = Buffer.from(response.data);
                    photoBufferArray[photoKey] = photoBuffer;
                }
            }
        }

        const newPost = new ContentModel({p_Id: idCount + 1, p_Title, p_TextContent, p_ShortDescription, p_Photos: photoBufferArray, p_Timestamp})
        await newPost.save()
        res.status(200).send({message: "Post succesfully created"})
    } catch (error) {
        res.status(500).send({ message: "Internal server error: ", error })
    }
}