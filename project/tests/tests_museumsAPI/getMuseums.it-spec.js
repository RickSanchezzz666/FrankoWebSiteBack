const { query } = require('express');
const { getMuseums } = require('../../controllers/museumsController/getMuseums')
const { MuseumsModel } = require('../../models/museumsModel');

const mongoose = require('mongoose');

describe('getMuseums', () => {
    const _id = new mongoose.Types.ObjectId("65a5587967a8ef1ccdb401a4")
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');

        await MuseumsModel.insertMany([
            {
                _id,
                ukrainian: {
                    title: "назва",
                    workingHours: "години",
                    workingDays: "дні",
                    address: "адреса"
                },
                english: {
                    title: "title",
                    workingHours: "hours",
                    workingDays: "days",
                    address: "address"
                },
                phone: "phone",
                link: "link",
                photo: ["photo"]
            }
        ])
    })

    afterAll(async () => {
        await MuseumsModel.deleteMany();
    })

    describe('should be opened', () => {
        const res = {
            send: jest.fn(),
            status: jest.fn().mockImplementation(() => res)
        }

        it("no museumID send 200 and send museums", async () => {
            const req = {
                user: {
                    accessLevel: 1
                },
                query: {
                    lang: "en"
                },
                params: {
                    museumId: ""
                }

            }

            await getMuseums(req, res)


            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith([{
                _id,
                title: "title",
                workingHours: "hours",
                workingDays: "days",
                address: "address",
                phone: "phone",
                link: "link",
                photo: ["photo"]
            }])

        })

        it("with museumID send 200 and send museums", async () => {
            const req = {
                user: {
                    accessLevel: 1
                },
                query: {
                    lang: "en"
                },
                params: {
                    museumId: _id
                }

            }

            await getMuseums(req, res)


            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                title: "title",
                workingHours: "hours",
                workingDays: "days",
                address: "address",
                phone: "phone",
                link: "link",
                photo: ["photo"]
            })

        })
        it("send 404 with museum id and send message", async () => {
            const req = {
                user: {
                    accessLevel: 1
                },
                query: {
                    lang: "en"
                },
                params: {
                    museumId: "65a5587967a8ef1ccdb401a5"
                }

            }

            await getMuseums(req, res)


            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: "Музей з таким ID відсутній" })

        })

        it("send 404 with museum id and send message", async () => {
            const req = {
                user: {
                    accessLevel: 1
                },
                query: {
                    lang: "en"
                },
                params: {
                    museumId: "65a5587967a8ef1ccdb401a5"
                }

            }

            await getMuseums(req, res)

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: "Музей з таким ID відсутній" })

        })

        it("send 400 with invalid museum id and send message", async () => {
            const req = {
                user: {
                    accessLevel: 1
                },
                query: {
                    lang: "en"
                },
                params: {
                    museumId: "123"
                }

            }

            await getMuseums(req, res)

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: "Недійсний ідентифікатор музею" })

        })

        it("send 500 and send message", async () => {


            const err = new Error;
            const reqErr = jest.fn().mockImplementation(async () => { throw err })


            await getMuseums(reqErr, res)

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })

        })

        it("send 404 with no museum id and send message", async () => {
            const req = {
                user: {
                    accessLevel: 1
                },
                query: {
                    lang: "en"
                },
                params: {
                    museumId: ""
                }

            }

            await MuseumsModel.deleteMany();

            await getMuseums(req, res)

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: "Не знайдено жодної інформації про партнерські музеї" })

        })

    })
})