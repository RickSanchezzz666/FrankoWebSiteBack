const { deletePost } = require('../../controllers/postsController/deletePost')
const { loggerModule } = require('../../controllers/logger')


const originalLoggerModule = require('../../controllers/logger').loggerModule;
jest.mock('../../controllers/logger', () => ({
    loggerModule: jest.fn()
}));

describe("deletePost", () => {
    const res = {
        send: jest.fn(),
        status: jest.fn().mockReturnThis()
    }

    describe('should be opened', () => {
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

        const err = new Error;
        const reqErr = jest.fn().mockImplementation(async () => { throw err });

        it("and throw error 500, message and logs", async () => {
            try {
                await deletePost(reqErr, res);
            } catch (err) {
                originalLoggerModule.mockImplementation(() => Promise.resolve());

                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.send).toHaveBeenCalledWith({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })

                expect(originalLoggerModule).toHaveBeenCalledWith(`Помилка сервера, ${err}`, "Console");
            }
        })
        it("and throw error 403, message and logs", async () => {
            await deletePost(req, res);

            originalLoggerModule.mockImplementation(() => Promise.resolve());

            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.send).toHaveBeenCalledWith({ message: "Ваш рівень доступу недостатній" })

            expect(originalLoggerModule).toHaveBeenCalledWith(`Недостатньо прав: Користувач ${req.user.fullName} спробував видалити публікацію`, "Console");

        })
    })
})