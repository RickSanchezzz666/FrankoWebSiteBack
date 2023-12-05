const axios = require('axios');
const { ContentModel } = require('../../models/contentModel');
const { loggerModule } = require('../logger');

module.exports.createPost = async (req, res) => {
    try {
        if (req.user.u_AccessLevel === 0 || req.user.u_AccessLevel === 1) {
            let idCount = await ContentModel.countDocuments();
            let postId = idCount + 1;
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

            const newPost = new ContentModel({ p_Id: postId, p_Title, p_TextContent, p_ShortDescription, p_Photos: photoBufferArray, p_Timestamp })
            await newPost.save()
            await loggerModule(`Публікація з ID ${postId} створена`, req.user.u_Login);
            res.status(200).send({ message: "Post succesfully created." })
        } else {
            await loggerModule(`Користувач ${req.user.u_Fullname} спробував створити публікацію`, "Console");
            return res.status(403).send({ message: "Your access level is not enough."});
        };
    } catch (err) {
        await loggerModule(`Помилка сервера, ${err}`, "Console");
        res.status(500).send({ message: "Internal server error" })
    };
}