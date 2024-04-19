const { editPost } = require('../../controllers/postsController/editPost')
const { ContentModel } = require('../../models/contentModel')
const fs = require('fs');
const path = require('path')

const mongoose = require('mongoose');

describe('editPost', () => {
    const _id = new mongoose.Types.ObjectId("65a5587967a8ef1ccdb401a5");
    const fileBuffer = fs.readFileSync(path.resolve(__dirname, '../test_photos/25231.pdf'));

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');

        const photoURLs = [
            "https://res.cloudinary.com/dx03vy5vs/image/upload/v1705334903/brwzyuojagoza77xfnhd.jpg",
            "https://res.cloudinary.com/dx03vy5vs/image/upload/v1705334903/djeaacszf95dcumb5l0b.jpg"
        ]
        await ContentModel.insertMany([
            {
                _id,
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
        it('and create post and return 200, message and logs', async () => {
            const req = {
                headers: {},
                user: {
                    accessLevel: 0,
                    login: "Rick Sanchez",
                    fullName: "Rick Sanchez"
                },
                body: {
                    postId: _id,
                    ukrTitle: "новий Назва",
                    ukrDescription: "новий Опис",
                    ukrShortDescription: "новий Короткий опис",
                    engTitle: "new Title",
                    engDescription: "new Desc",
                    engShortDescription: "new Short Desc",
                }
            }

            await editPost(req, res)

            await new Promise(resolve => setTimeout(resolve, 2500));
            
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith({ message: "Публікація успішно оновлена!" })
        })
        it('and return 400, message and logs', async () => {
            const req = {
                headers: {},
                user: {
                    accessLevel: 0,
                    login: "Rick Sanchez",
                    fullName: "Rick Sanchez"
                },
                body: {
                    postId: "id",
                    ukrTitle: "новий Назва",
                    ukrDescription: "новий Опис",
                    ukrShortDescription: "новий Короткий опис",
                    engTitle: "new Title",
                    engDescription: "new Desc",
                    engShortDescription: "new Short Desc",
                }
            }

            await editPost(req, res)

            await new Promise(resolve => setTimeout(resolve, 2000));
            
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({ message: "Недійсний або відсутній ідентифікатор публікації" })
        })
        it('and return 404, message and logs', async () => {
            const req = {
                headers: {},
                user: {
                    accessLevel: 0,
                    login: "Rick Sanchez",
                    fullName: "Rick Sanchez"
                },
                body: {
                    postId: "65a5587967a8ef1ccdb401a4",
                    ukrTitle: "новий Назва",
                    ukrDescription: "новий Опис",
                    ukrShortDescription: "новий Короткий опис",
                    engTitle: "new Title",
                    engDescription: "new Desc",
                    engShortDescription: "new Short Desc",
                }
            }

            await editPost(req, res)

            await new Promise(resolve => setTimeout(resolve, 2000));
            
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.send).toHaveBeenCalledWith({ message: "Відсутні записи із таким ідентифікатором публікації" })
        })
        
    })

})

