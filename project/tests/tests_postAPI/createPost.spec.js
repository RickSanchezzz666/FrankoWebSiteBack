const { createPost } = require('../../controllers/postsController/createPost')
const { loggerModule } = require('../../controllers/logger')
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

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

describe('createPost', () => {
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
})