const { getPosts } = require('../../controllers/postsController/getPosts')
const { ContentModel } = require('../../models/contentModel')

const mongoose = require('mongoose')

describe('getPosts', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');

        const photoURLs = [
            "https://res.cloudinary.com/dx03vy5vs/image/upload/v1705334903/brwzyuojagoza77xfnhd.jpg",
            "https://res.cloudinary.com/dx03vy5vs/image/upload/v1705334903/djeaacszf95dcumb5l0b.jpg"
        ]
        await ContentModel.insertMany([
            {
                _id: new mongoose.Types.ObjectId("65a5587967a8ef1ccdb401a2"),
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
        describe('with no postId', () => {
            const req = {
                user: {
                    accessLevel: 0,
                    login: "admin0",
                    fullName: "Rick Sanchez",
                },
                params: {
                    postId: null
                }, 
                query: {
                    lang: 'en'
                }
            }
            it("and return 200 and send posts", async () => {
                await getPosts(req, res)

                const selector = 'english';

                let posts = await ContentModel.find({}, {
                    [selector]: { 'title': 1, 'shortDescription': 1 },
                    'timestamp': 1,
                    'photos': { $slice: 1 }
                }).sort({ 'Timestamp': -1 });
                
                posts = posts.map(post => {
                    const languageContent = post[selector];
                    return {
                        _id: post._id,
                        title: languageContent.title,
                        shortDescription: languageContent.shortDescription,
                        timestamp: post.timestamp,
                        photos: post.photos.length > 0 ? post.photos[0].replace(/(\/upload\/)/, '$1t_min-amif/') : []
                    };
                });

                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.send).toHaveBeenCalledWith(posts)

                await ContentModel.deleteMany();
            })
            it("and return error 404 and send message", async () => {
                await getPosts(req, res)

                expect(res.status).toHaveBeenCalledWith(404)
                expect(res.send).toHaveBeenCalledWith({ message: "Не знайдено жодної публікації" })
            })
        })

        describe("with postId", () => {
            it('and return 200 and send post', async () => {
                const photoURLs = [
                    "https://res.cloudinary.com/dx03vy5vs/image/upload/v1705334903/brwzyuojagoza77xfnhd.jpg",
                    "https://res.cloudinary.com/dx03vy5vs/image/upload/v1705334903/djeaacszf95dcumb5l0b.jpg"
                ]
                await ContentModel.insertMany([
                    {
                        _id: new mongoose.Types.ObjectId("65a5587967a8ef1ccdb401a3"),
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

                const req = {
                    user: {
                        accessLevel: 0,
                        login: "admin0",
                        fullName: "Rick Sanchez",
                    },
                    params: {
                        postId: "65a5587967a8ef1ccdb401a3"
                    }, 
                    query: {
                        lang: 'en'
                    }
                }

                const post = await ContentModel.findById('65a5587967a8ef1ccdb401a3');

                const selector = post.english;

                const responsePost = {
                    ...selector,
                    timestamp: post.timestamp,
                    photos: post.photos,
                };

                await getPosts(req, res)

                expect(res.status).toHaveBeenCalledWith(200)
                expect(res.send).toHaveBeenCalledWith(responsePost)

                await ContentModel.deleteMany()
            })

            it('and return 404 and send message', async () => {
                const req = {
                    user: {
                        accessLevel: 0,
                        login: "admin0",
                        fullName: "Rick Sanchez",
                    },
                    params: {
                        postId: "65a5587967a8ef1ccdb401a3"
                    }, 
                    query: {
                        lang: 'en'
                    }
                }

                await getPosts(req, res)

                expect(res.status).toHaveBeenCalledWith(404)
                expect(res.send).toHaveBeenCalledWith({ message: "Публікація з таким ID відсутня" })
            })
        })
    })
})