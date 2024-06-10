const { createPost } = require('./createPostFixed')
const { ContentModel } = require('../../models/contentModel')
const fs = require('fs');
const path = require('path')

const mongoose = require('mongoose');

describe('createPost', () => {
    const fileBuffer = fs.readFileSync(path.resolve(__dirname, '../test_photos/25231.png'));

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');
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
                    ukrTitle: "Назва",
                    ukrDescription: "Опис",
                    ukrShortDescription: "Короткий опис",
                    engTitle: "Title",
                    engDescription: "Desc",
                    engShortDescription: "Short Desc",
                },
                files: [
                    {
                        buffer: fileBuffer
                    }
                ]

            }

            await createPost(req, res)

            await new Promise(resolve => setTimeout(resolve, 2000));

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith({ message: "Публікація успішно створена!" })
        })

        it('and return 400 on upload (0 files), message and logs', async () => {
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
                },
                files: []
            }

            await createPost(req, res)

            await new Promise(resolve => setTimeout(resolve, 2000));
            
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({ message: "Будь ласка завантажте принаймні 1 фото" })
        })
        it('and return 400 (not all fields), message and logs', async () => {
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
                },
                files: [
                    {
                        buffer: fileBuffer
                    }
                ]
            }

            await createPost(req, res)

            await new Promise(resolve => setTimeout(resolve, 2000));
             
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({ message: "Будь ласка заповніть всі поля" })
        })
    })

})

