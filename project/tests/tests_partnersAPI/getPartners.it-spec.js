const { getPartners } = require('../../controllers/partnersController/getPartners')
const { PartnersModel } = require('../../models/partnersModel');

const mongoose = require('mongoose');

describe('getPartners', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');

        await PartnersModel.insertMany([
            {
                name: "partner",
                link: "link",
                logo: ["logo"]
            }
        ])
    })

    afterAll(async () => {
        await PartnersModel.deleteMany();
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

            await getPartners(req, res)

            const partners = await PartnersModel.find()

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(partners)

        })

        it("send 404 and send error", async () => {
            const req = {
                user: {
                    accessLevel: 1
                }
            }

            await PartnersModel.deleteMany()

            await getPartners(req, res)


            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: "Не знайдено жодної партнерської організації" })

        })
    })
})