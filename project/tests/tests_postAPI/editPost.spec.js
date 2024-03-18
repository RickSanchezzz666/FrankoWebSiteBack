const { editPost } = require('../../controllers/postsController/editPost')
const { loggerModule } = require('../../controllers/logger')
const cloudinary = require('cloudinary').v2;

const originalLoggerModule = require('../../controllers/logger').loggerModule;
jest.mock('../../controllers/logger', () => ({
    loggerModule: jest.fn()
}));

function configureCloudinary() {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

function fileFilter(req, file, cb) {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        loggerModule(`File rejected: Invalid file type - ${file.mimetype}`, "Console");
        cb(new Error("Invalid file type"), false);
    }
}

describe('editPost', () => {
    describe("config: ", () => {
        const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
        const api_key = process.env.CLOUDINARY_API_KEY
        const api_secret = process.env.CLOUDINARY_API_SECRET

        it('cloudinary config should be equal to environment', () => {
            configureCloudinary()

            expect(cloudinary.config().cloud_name).toEqual(cloud_name)
            expect(cloudinary.config().api_key).toEqual(api_key)
            expect(cloudinary.config().api_secret).toEqual(api_secret)
        })
        describe('upload function fileFilter:', () => {

            const req = {}
            const cb = jest.fn()
            it('fileFilter should accept valid file types', () => {
                const file = { mimetype: 'image/jpeg' }
                fileFilter(req, file, cb);

                expect(cb).toHaveBeenCalledWith(null, true)
            })
            it('fileFilter should decline invalid file types', () => {
                const file = { mimetype: 'image/pdf' }
                fileFilter(req, file, cb);

                originalLoggerModule.mockImplementation(() => Promise.resolve());

                expect(cb).toHaveBeenCalledWith(new Error("Invalid file type"), false)

                expect(originalLoggerModule).toHaveBeenCalledWith(`File rejected: Invalid file type - ${file.mimetype}`, "Console");

            })
        })
    })
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
                },
                files: [
                    {
                        "fieldname": "attachments",
                        "originalname": "report-1557223111148.jpg",
                        "encoding": "7bit",
                        "mimetype": "image/jpg",
                        "destination": "./uploads",
                        "filename": "attachments-1557223117432",
                        "path": "uploads\\attachments-1557223117432",
                        "size": 87477
                    }
                ],
                headers: {}
            }

            try {
                await editPost(req, res)
            } catch (err) {
                originalLoggerModule.mockImplementation(() => Promise.resolve());

                expect(res.status).toHaveBeenCalledWith(500)
                expect(res.send).toHaveBeenCalledWith({ message: "Внутрішня помилка сервера, зверніться до технічного адміністратора" })

                expect(originalLoggerModule).toHaveBeenCalledWith(`Помилка сервера, ${err}`, "Console");
            }
        })
        it("and throw error 403, message and logs", async () => {
            const req = {
                user: {
                    accessLevel: 2,
                    login: "admin",
                    fullName: "Rick Sanchez",
                },
                body: {
                    postId: "65a5587967a8ef1ccdb401a9"
                },
                files: [
                    {
                        "fieldname": "attachments",
                        "originalname": "report-1557223111148.jpg",
                        "encoding": "7bit",
                        "mimetype": "image/jpg",
                        "destination": "./uploads",
                        "filename": "attachments-1557223117432",
                        "path": "uploads\\attachments-1557223117432",
                        "size": 87477
                    }
                ],
                headers: {}
            }

            try {
                await editPost(req, res)
            } catch (err) {
                originalLoggerModule.mockImplementation(() => Promise.resolve());

                expect(res.status).toHaveBeenCalledWith(403)
                expect(res.send).toHaveBeenCalledWith({ message: "Ваш рівень доступу недостатній" })

                expect(originalLoggerModule).toHaveBeenCalledWith(`Недостатньо прав: Користувач ${req.user.fullName} спробував створити публікацію`, "Console");
            }
        })
    })
})