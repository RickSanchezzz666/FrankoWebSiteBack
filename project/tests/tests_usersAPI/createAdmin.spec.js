const { createAdmin } = require('../../controllers/usersController/createAdmin')

const originalLoggerModule = require('../../controllers/logger').loggerModule;
jest.mock('../../controllers/logger', () => ({
    loggerModule: jest.fn()
}));

describe('createAdmin', () => {
    const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
    }

    const err = new Error;
    const reqErr = jest.fn().mockImplementation(async () => { throw err })

    describe('should be opened', () => {
        it('throw error 500, message and logs', async () => {
            try {
                await createAdmin(reqErr, res);
            } catch (err) {
                originalLoggerModule.mockImplementation(() => Promise.resolve());

                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.send).toHaveBeenCalledWith({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })

                expect(originalLoggerModule).toHaveBeenCalledWith(`Помилка сервера, ${err}`, "Console");
            }
        })

        it('throw error 403, message and logs', async () => {
            const req = {
                user: {
                    accessLevel: 2,
                    fullName: "Tommy Vercetti"
                },
                query: {
                    key: process.env.LOGS_KEY
                }
            }

            await createAdmin(req, res);

            originalLoggerModule.mockImplementation(() => Promise.resolve());

            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.send).toHaveBeenCalledWith({ message: "Ваш рівень доступу недостатній" })

            expect(originalLoggerModule).toHaveBeenCalledWith(`Недостатньо прав: Користувач ${req.user.fullName} спробував створити користувача`, "Console");

        })

        it('throw error 400 and message', async () => {
            const req = {
                user: {
                    accessLevel: 1,
                    fullName: "Tommy Vercetti"
                },
                query: {
                    key: process.env.LOGS_KEY
                },
                body: {}
            }

            await createAdmin(req, res);

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({ message: "Будь ласка заповніть всі поля" })

        })
    })
})