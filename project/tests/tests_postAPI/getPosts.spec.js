const { getPosts } = require('../../controllers/postsController/getPosts')
const { loggerModule } = require('../../controllers/logger')

const originalLoggerModule = require('../../controllers/logger').loggerModule;
jest.mock('../../controllers/logger', () => ({
    loggerModule: jest.fn()
}));

describe('getPosts', () => {
    describe("should be opened", () => {
        const res = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis()
        }

        it("and throw error 500, message and logs", async () => {
            const req = {
                user: {
                    accessLevel: 2,
                    login: "admin",
                    fullName: "Rick Sanchez",
                },
                body: {
                    postId: "65a5587967a8ef1ccdb401a9"
                }
            }

            try {
                await getPosts(req, res)
            } catch (err) {
                originalLoggerModule.mockImplementation(() => Promise.resolve());

                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.send).toHaveBeenCalledWith({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })

                expect(originalLoggerModule).toHaveBeenCalledWith(`Помилка сервера, ${err}`, "Console");
            }
        })
        it("and throw error 400 and send message", async () => {
            const req = {
                user: {
                    accessLevel: 2,
                    login: "admin",
                    fullName: "Rick Sanchez",
                },
                params: {
                    postId: "1234"
                },
                query: {
                    lang: 'en'
                }
            }

            await getPosts(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({ message: "Недійсний ідентифікатор публікації" })

        })
    })
})