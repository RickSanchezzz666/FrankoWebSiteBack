const { deleteMuseum } = require('../../controllers/museumsController/deleteMuseum')
const { MuseumsModel } = require('../../models/museumsModel');
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

describe('deleteMuseum', () => {
    const _id = new mongoose.Types.ObjectId("65a5587967a8ef1ccdb401a7")
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');

        await MuseumsModel.insertMany([
            {
                _id,
                title: "title",
                workingHours: "hours",
                workingDays: "days",
                phone: "phone",
                address: "address",
                link: "https://www.link.com/",
                photo: ["photo"]
            }
        ])
    })

    afterAll(async () => {
        await MuseumsModel.deleteMany();
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

            await deleteMuseum(req, res)


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: "Недійсний або відсутній ідентифікатор карточки музею" })

        })

        it("send 404 and send error", async () => {
            const req = {
                user: {
                    accessLevel: 1
                },
                body: {
                    museumId: "66030d4d22e8a1b7cf075ea0"
                }
            }

            await deleteMuseum(req, res)

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: "Відсутні записи із таким ідентифікатором карточки музею" })

        })

        it("send 200 and send message", async () => {
            const req = {
                user: {
                    accessLevel: 1,
                    login: "admin0"
                },
                body: {
                    museumId: _id
                }
            }

            await deleteMuseum(req, res)

            originalLoggerModule.mockImplementation(() => Promise.resolve());

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: "Карточка музею видалена!" })
            expect(cloudinary.uploader.destroy).toHaveBeenCalled();

            expect(originalLoggerModule).toHaveBeenCalledWith(`Карточка музею з ID ${_id} видалена`, req.user.login);
        })
    })
})