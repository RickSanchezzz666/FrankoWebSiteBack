const { deletePartner } = require('../../controllers/partnersController/deletePartner')
const { PartnersModel } = require('../../models/partnersModel');
const cloudinary = require('cloudinary').v2;

const mongoose = require('mongoose');

cloudinary.uploader.destroy = jest.fn().mockResolvedValue({ result: "ok" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const originalLoggerModule = require('../../controllers/logger').loggerModule;
jest.mock('../../controllers/logger', () => ({
    loggerModule: jest.fn()
}));

describe('deletePartner', () => {
    const _id = new mongoose.Types.ObjectId("65a5587967a8ef1ccdb401a3")
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');

        await PartnersModel.insertMany([
            {
                _id,
                name: "FrankoHouse",
                link: "https://www.facebook.com/dimfranka/",
                logo: ["https://res.cloudinary.com/mumbai0testnet01/image/upload/v1711476044/hd40juv1kbh1fcmc01pq.png   "]
            }
        ])
    })

    afterAll(async () => {
        await PartnersModel.deleteMany();
        jest.clearAllMocks();
    })

    describe('should be opened', () => {
        const res = {
            send: jest.fn(),
            status: jest.fn().mockImplementation(() => res)
        }

        it("send 400 and send message", async () => {
            const req = {
                user: {
                    accessLevel: 1
                },
                body: {}
            }

            await deletePartner(req, res)


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: "Недійсний або відсутній ідентифікатор партнерської організації" })

        })

        it("send 404 and send error", async () => {
            const req = {
                user: {
                    accessLevel: 1
                },
                body: {
                    partnerId: "66030d4d22e8a1b7cf075ea0"
                }
            }

            await deletePartner(req, res)

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: "Відсутні записи із таким ідентифікатором публікації" })

        })

        it("send 200 and send message", async () => {
            const req = {
                user: {
                    accessLevel: 1,
                    login: "admin0"
                },
                body: {
                    partnerId: _id
                }
            }

            PartnersModel.findByIdAndDelete = jest.fn().mockResolvedValueOnce();

            await deletePartner(req, res)

            originalLoggerModule.mockImplementation(() => Promise.resolve());
            
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: "Партнерська організація видалена!" })
            expect(cloudinary.uploader.destroy).toHaveBeenCalled();
            
            expect(originalLoggerModule).toHaveBeenCalledWith(`Партнерська організація з ID ${_id} видалена`, req.user.login);
        })
    })
})