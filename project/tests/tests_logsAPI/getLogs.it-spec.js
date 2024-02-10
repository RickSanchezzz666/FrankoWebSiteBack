const { getLogs } = require('../../controllers/logsController/getLogs')
const { LogsModel } = require('../../models/logsModel');

const mongoose = require('mongoose');

describe('getLogs', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');


        await LogsModel.insertMany([
            {
                log_Action: "Користувач авторизувався",
                log_ByUser: "admin",
                log_Timestamp: "2024-01-18T10:31:33.326Z"
            }
        ])


    });

    afterAll(async () => {
        await LogsModel.deleteMany();
    })

    describe("should be opened", () => {
        const res = {
            send: jest.fn(),
            status: jest.fn().mockImplementation(() => res)

        }
        it("and logs should be received", async () => {
            const req = {
                user: {
                    accessLevel: 1
                },
                query: {
                    key: process.env.LOGS_KEY
                }

            }

            await getLogs(req, res)

            const logs = await LogsModel.find({});

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(logs)

        })

    })

})
