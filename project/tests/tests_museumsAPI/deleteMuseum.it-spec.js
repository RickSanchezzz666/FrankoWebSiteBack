const { deleteMuseum } = require('../../controllers/museumsController/deleteMuseum')
const { MuseumsModel } = require('../../models/museumsModel');

const mongoose = require('mongoose');

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
                }
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

            expect(originalLoggerModule).toHaveBeenCalledWith(`Карточка музею з ID ${_id} видалена`, req.user.login);
        })
    })
})