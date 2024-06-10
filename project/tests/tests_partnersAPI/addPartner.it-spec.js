const { addPartner } = require('./addPartnerNoFileUpload')
const { PartnersModel } = require('../../models/partnersModel');

const mongoose = require('mongoose')

describe('addPartner', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');
    })

    afterAll(async () => {
        await PartnersModel.deleteMany();
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
                    name: "name",
                    link: "https://www.audiostories.pro/"
                }
            }

            await addPartner(req, res);


            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: "Партнерська організація успішно додана!" })
        })

        it("send 400 and send message", async () => {
            const req = {
                user: {
                    accessLevel: 0,
                    login: "Rick Sanchez",
                    fullName: "Rick Sanchez"
                },
                body: {
                    link: "https://www.audiostories.pro/"
                }
            }

            await addPartner(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: "Будь ласка заповніть поле 'name'" })
        })
    })
})