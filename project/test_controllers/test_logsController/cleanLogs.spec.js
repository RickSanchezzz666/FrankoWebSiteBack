const { cleanLogs } = require('../../controllers/logsController/cleanLogs')

const originalLoggerModule = require('../../controllers/logger').loggerModule;
    jest.mock('../../controllers/logger', () => ({
      loggerModule: jest.fn()
    }));

describe('cleanLogs', () => {
    const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
    }

    const err = new Error;
    const reqErr = jest.fn().mockImplementation(async () => {throw err})

    it('should be opened and throw error 500 and send message', async () => {
        try {
            await cleanLogs(reqErr, res);
        } catch (err) {
            originalLoggerModule.mockImplementation(() => Promise.resolve());

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.send).toHaveBeenCalledWith({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })

            expect(originalLoggerModule).toHaveBeenCalledWith(`Помилка сервера, ${err}`, "Console");
        }
    })

})