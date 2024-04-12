const { addMuseum } = require('./addMuseumNoFileUpload')
const { MuseumsModel } = require('../../models/museumsModel');

const mongoose = require('mongoose')

describe('addMuseum', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');
    })

    afterAll(async () => {
        await MuseumsModel.deleteMany();
        jest.clearAllMocks();
    })

    const res = {
        send: jest.fn(),
        status: jest.fn().mockImplementation(() => res)
    }

    describe('should be opened', () => {
        it("send 200 and send message", async () => {
            const req = {
                user: {
                    accessLevel: 0,
                    login: "Rick Sanchez",
                    fullName: "Rick Sanchez"
                },
                body: {
                    title: "title",
                    workingHours: "hours",
                    workingDays: "days",
                    phone: "phone",
                    address: "address",
                    link: "https://www.link.com/",
                    photo: ["photo"]
                }
            }

            await addMuseum(req, res);


            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: "Карточка музею успішно додана!" })
        })

        it("send 400 and send message", async () => {
            const req = {
                user: {
                    accessLevel: 0,
                    login: "Rick Sanchez",
                    fullName: "Rick Sanchez"
                },
                body: {
                    link: "https://www.link.com/"
                }
            }

            await addMuseum(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: "Будь ласка заповніть поля позначені " * "!" })
        })
    })
})