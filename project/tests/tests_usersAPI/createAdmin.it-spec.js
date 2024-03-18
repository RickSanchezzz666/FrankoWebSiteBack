const { createAdmin } = require('../../controllers/usersController/createAdmin')
const { UsersModel } = require('../../models/usersModel');

const mongoose = require('mongoose');

describe("createAdmin", () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');    
    });
    
    afterAll(async () => {
        await UsersModel.deleteMany();
    })

    describe("should be opened", () => {
        const res = {
            send: jest.fn(),
            status: jest.fn().mockImplementation(() => res)
    
        }
    
        const req = {
            user: {
                accessLevel: 1,
                fullName: "Tommy",
                login: "TommyGun"
            },
            body: {
                login: 'testAdmin',
                password: 'testAdmin',
                fullName: 'fullAdminName'
            },
            query: {
                key: process.env.LOGS_KEY
            }
        }

        it("return 200 and message", async () => {
            await createAdmin(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({message: "Ви успішно створили нового адміністратора!"})
        })

        it('return 409 and message', async () => {
            await createAdmin(req, res)

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.send).toHaveBeenCalledWith({ message: "Користувач з цим логіном вже існує" })
        })
    })
})
