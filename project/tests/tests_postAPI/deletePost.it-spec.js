const { deletePost } = require('../../controllers/postsController/deletePost')
const { ContentModel } = require('../../models/contentModel')

const mongoose = require('mongoose');

describe('deletePost', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');

        const photoURLs = [
            "https://res.cloudinary.com/dx03vy5vs/image/upload/v1705334903/brwzyuojagoza77xfnhd.jpg",
            "https://res.cloudinary.com/dx03vy5vs/image/upload/v1705334903/djeaacszf95dcumb5l0b.jpg"
        ]
        await ContentModel.insertMany([
            {
                _id: new mongoose.Types.ObjectId("65a5587967a8ef1ccdb401a9"),
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
    })

    describe("should be opened", () => {
        const res = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        }

        it("and delete post and return 200, message and logger", async () => {
            const req = {
                user: {
                    accessLevel: 0,
                    login: "admin0",
                    fullName: "Rick Sanchez",
                },
                body: {
                    postId: "65a5587967a8ef1ccdb401a9"
                }
            }

            await deletePost(req, res)

            const post = await ContentModel.find({})

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith({ message: "Публікація успішно видалена!" })
            expect(post).toStrictEqual([])
        })
        it("and return 400 and send message", async () => {
            const req = {
                user: {
                    accessLevel: 0,
                    login: "admin0",
                    fullName: "Rick Sanchez",
                },
                body: {
                    postId: "123"
                }
            }

            await deletePost(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({ message: "Недійсний або відсутній ідентифікатор публікації" })
        })
        it("and return 404 and send message", async () => {
            const req = {
                user: {
                    accessLevel: 0,
                    login: "admin0",
                    fullName: "Rick Sanchez",
                },
                body: {
                    postId: "65a5587967a8ef1ccdb401a8"
                }
            }

            await deletePost(req, res)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.send).toHaveBeenCalledWith({ message: "Відсутні записи із таким ідентифікатором публікації" })
        })
    })
})