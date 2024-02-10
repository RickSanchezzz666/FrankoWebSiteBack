const { createPost } = require('../../controllers/postsController/createPost')
const { ContentModel } = require('../../models/contentModel')

const mongoose = require('mongoose');

/*describe('createPost', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');
    });

    afterAll(async () => {
        await ContentModel.deleteMany();
    })

    describe('should be opened', () => {
        const res = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        }

        it('and create post and return 200, message and logs', async () => {
            const req = {
                headers: {},
                user: {
                    accessLevel: 0,
                    login: "Rick Sanchez",
                    fullName: "Rick Sanchez"
                },
                body: {
                    ukrTitle: "Назва",
                    ukrDescription: "Опис",
                    ukrShortDescription: "Короткий опис",
                    engTitle: "Title",
                    engDescription: "Desc",
                    engShortDescription: "Short Desc",
                },
                files: [
                    {
                        fieldname: 'avatar',
                        originalname: 'scrim.jpg',
                        name: 'scrim.jpg',
                        encoding: '7bit',
                        mimetype: 'image/jpeg',
                        path: '/scrim.jpg',
                        extension: 'jpg',
                        size: 86580,
                        truncated: false,
                        buffer: null,
                        webkitRelativePath: ""
                    }
                ]

            }

            await createPost(req, res)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith({ message: "Публікація успішно створена!" })
        })
    })
})*/