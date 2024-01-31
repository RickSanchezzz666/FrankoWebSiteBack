const { LogsModel } = require('../../models/logsModel');
const { loggerModule } = require('../../controllers/logger')

const mongoose = require('mongoose');

describe('logger', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI, {
            auth: {
                username: process.env.MONGO_DB_LOGIN,
                password: process.env.MONGO_DB_PASS
            }
        });
        console.log('mongoose was connected');
    })

    afterAll(async () => {
        await LogsModel.deleteMany();
    })

    const action = "Successful log!"
    const byUSer = "Rick Sanchez"

    it('should be opened and save logs', async () => {
        const time = new Date();
        await loggerModule(action, byUSer)

        const logs = await LogsModel.findOne()
        
        expect(logs.log_Action).toBe(action)
        expect(logs.log_ByUser).toBe(byUSer)
        expect(logs.log_Timestamp.getTime()).toBeCloseTo(time.getTime(), 0)
    })

})