const { getPostAdmin } = require('../../controllers/postsController/getPostAdmin')
const { loggerModule } = require('../../controllers/logger')

const originalLoggerModule = require('../../controllers/logger').loggerModule;
jest.mock('../../controllers/logger', () => ({
    loggerModule: jest.fn()
}));

describe("getPostAdmin", () => {
    const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
    }
    describe("should be opened", () => {
        const err = new Error;
        const reqErr = jest.fn().mockImplementation(async () => { throw err });

        it("and throw error 500, message and logs", async () => {
            try {
                await getPostAdmin(reqErr, res);
            } catch (err) {
                originalLoggerModule.mockImplementation(() => Promise.resolve());

                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.send).toHaveBeenCalledWith({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })

                expect(originalLoggerModule).toHaveBeenCalledWith(`Помилка сервера, ${err}`, "Console");
            }
        })
        it("and throw error 403 and message", async () => {
            const req = {
                user: {
                    accessLevel: 2,
                    login: "admin",
                    fullName: "Rick Sanchez",
                }
            }
            await getPostAdmin(req, res)

            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.send).toHaveBeenCalledWith({ message: "Ваш рівень доступу недостатній" })
        })
        it("and throw error 400 and message !postId", async () => {
            const req = {
                user: {
                    accessLevel: 0,
                    login: "admin0",
                    fullName: "Rick Sanchez",
                },
                params: {
                    postId: null
                }
            }

            await getPostAdmin(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({ message: "Відсутній ідентифікатор публікації" })
        })
        it("and throw error 400 and message !isValid(postId)", async () => {
            const req = {
                user: {
                    accessLevel: 0,
                    login: "admin0",
                    fullName: "Rick Sanchez",
                },
                params: {
                    postId: "123"
                }
            }

            await getPostAdmin(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({ message: "Недійсний ідентифікатор публікації" })
        })
    })
})
