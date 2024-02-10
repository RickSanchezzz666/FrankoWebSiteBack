const { getPostAdmin } = require('../../controllers/postsController/getPostAdmin')
const { ContentModel } = require('../../models/contentModel')

const mongoose = require('mongoose')

describe('getPostAdmin', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');

        const photoURLs = [
            "https://res.cloudinary.com/dx03vy5vs/image/upload/v1705334903/brwzyuojagoza77xfnhd.jpg",
            "https://res.cloudinary.com/dx03vy5vs/image/upload/v1705334903/djeaacszf95dcumb5l0b.jpg"
        ]
        await ContentModel.insertMany([
            {
                _id: new mongoose.Types.ObjectId("65a5587967a8ef1ccdb401a0"),
                ukrainian: {
                    title: "Назва",
                    description: "Опис",
                    shortDescription: "Короткий Опис"
                },
                english: {
                    title: "engTitle",
                    description: "engDescription",
                    shortDescription: "engShortDescription"
                },
                photos: photoURLs,
                timestamp: new Date()
            }
        ])
    });

    afterAll(async () => {
        await ContentModel.deleteMany();
    }, 10000)

    describe('should be opened', () => {
        const res = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        }
        it("and return 200 and send post", async () => {
            const req = {
                user: {
                    accessLevel: 0,
                    login: "admin0",
                    fullName: "Rick Sanchez",
                },
                params: {
                    postId: "65a5587967a8ef1ccdb401a0"
                }
            }

            await getPostAdmin(req, res)

            const post = await ContentModel.findById("65a5587967a8ef1ccdb401a0")

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(post)
        })
        it('and return 404 and send message', async () => {
            const req = {
                user: {
                    accessLevel: 0,
                    login: "admin0",
                    fullName: "Rick Sanchez",
                },
                params: {
                    postId: "65a5587967a8ef1ccdb401a8"
                }
            }

            await getPostAdmin(req, res)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.send).toHaveBeenCalledWith({ message: "Публікація з таким ID відсутня" })
        })
    })
})