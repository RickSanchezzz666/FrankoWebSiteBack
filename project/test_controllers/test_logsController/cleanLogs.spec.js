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

    it('should be opened and throw error 500 and send message and logs', async () => {
        try {
            await cleanLogs(reqErr, res);
        } catch (err) {
            originalLoggerModule.mockImplementation(() => Promise.resolve());

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.send).toHaveBeenCalledWith({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })

            expect(originalLoggerModule).toHaveBeenCalledWith(`Помилка сервера, ${err}`, "Console");
        }
    })
    it('should be opened and return error 403 and message', async () => {
        const req = {
            user: {
                accessLevel: 2,
                fullName: "Tommy Vercetti"
            },
            query: {
                key: process.env.LOGS_KEY
            }
        } 

        await cleanLogs(req, res);

        originalLoggerModule.mockImplementation(() => Promise.resolve());

        expect(res.status).toHaveBeenCalledWith(403)
        expect(res.send).toHaveBeenCalledWith({ message: "Ваш рівень доступу недостатній"})

        expect(originalLoggerModule).toHaveBeenCalledWith(`Недостатньо прав: Користувач ${req.user.fullName} спробував видалити сервер-лог`, "Console");

    })
})