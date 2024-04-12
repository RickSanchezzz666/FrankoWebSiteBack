const { getMuseums } = require('../../controllers/museumsController/getMuseums')
const { MuseumsModel } = require('../../models/museumsModel');

const mongoose = require('mongoose');

describe('getMuseums', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');

        await MuseumsModel.insertMany([
            {
                title: "title",
                workingHours: "hours",
                workingDays: "days",
                phone: "phone",
                address: "address",
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

        it("send 200 and send partners", async () => {
            const req = {
                user: {
                    accessLevel: 1
                }
            }

            await getMuseums(req, res)

            const museums = await MuseumsModel.find()

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(museums)

        })

        it("send 404 and send error", async () => {
            const req = {
                user: {
                    accessLevel: 1
                }
            }

            await MuseumsModel.deleteMany()

            await getMuseums(req, res)


            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: "Не знайдено жодної карточки музею" })

        })
    })
})