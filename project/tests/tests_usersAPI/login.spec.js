const { login } = require('../../controllers/usersController/login')

const originalLoggerModule = require('../../controllers/logger').loggerModule;
jest.mock('../../controllers/logger', () => ({
    loggerModule: jest.fn()
}));

describe('login', () => {
    const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
    }

    const err = new Error;
    const reqErr = jest.fn().mockImplementation(async () => { throw err })

    describe("should be opened", () => {
        it('throw error 500, message and logs', async () => {
            try {
                await login(reqErr, res);
            } catch (err) {
                originalLoggerModule.mockImplementation(() => Promise.resolve());
    
                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.send).toHaveBeenCalledWith({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })
    
                expect(originalLoggerModule).toHaveBeenCalledWith(`Помилка сервера, ${err}`, "Console");
            }
        })

        it('throw error 400 and send message', async () => {
            const req = {
                user: {
                    accessLevel: 2,
                    fullName: "Tommy Vercetti"
                },
                query: {
                    key: process.env.LOGS_KEY
                },
                body: {}
            } 

            await login(req, res);

            
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({ message: 'Будь ласка заповніть всі поля' })

        })
    })

})