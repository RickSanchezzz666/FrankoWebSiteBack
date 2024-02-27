const { createAdmin } = require('../../controllers/usersController/createAdmin');
const { deleteAdmin } = require('../../controllers/usersController/deleteAdmin');
const { UsersModel } = require('../../models/usersModel');

const mongoose = require('mongoose');

describe("createAdmin", () => {
    const login = 'testAdmin'
    const fullName = 'fullAdminName'    
    const _id = new mongoose.Types.ObjectId("65a5587967a8ef1ccdb401a7")
    const _id2 = new mongoose.Types.ObjectId("65a5587967a8ef1ccdb401a5")

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');

        await UsersModel.insertMany([{
            _id,
            login,
            password: 'testAdmin',
            fullName,
            accessLevel: 0
        },
        {
            _id: _id2,
            login: 'testAdmin2',
            password: 'testAdmin2',
            fullName: 'fullAdminName2',
            accessLevel: 1
        }])
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
                userId: _id
            },
            query: {
                key: process.env.LOGS_KEY
            }
        }

        it("return 200 and message", async () => {
            await deleteAdmin(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({ message: `Користувач '${fullName}' успішно видалений!` })
        })

        it("return 404 and message", async () => {
            await deleteAdmin(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({ message: "Користувач з таким ідентифікатором не знайдений" })
        })

        it('return 403 and message', async () => {
            const req = {
                user: {
                    accessLevel: 1,
                    fullName: "Tommy",
                    login: "TommyGun"
                },
                body: {
                    userId: _id2
                },
                query: {
                    key: process.env.LOGS_KEY
                }
            }

            await deleteAdmin(req, res)
            
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.send).toHaveBeenCalledWith({ message: "Ви не можете видалити цього користувача, зверніться до технічного адміністратора" })
        })

    })
})
