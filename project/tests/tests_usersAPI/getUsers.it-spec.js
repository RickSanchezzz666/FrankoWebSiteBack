const {getUsers} = require  ('../../controllers/usersController/getUsers')
const { UsersModel } = require('../../models/usersModel');

const mongoose = require('mongoose');

describe('getUsers', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');
    
    
        await UsersModel.insertMany([
            {
                login: "Admin",
                password: 'pass',
                fullName: "Lanosovich",
                accessLevel: 0
            }
        ])
    
    
    });
    
    afterAll(async () => {
        await UsersModel.deleteMany();
    })

    const res = {
        send: jest.fn(),
        status: jest.fn().mockImplementation(() => res)

    }

    const req = {
        user: {
            accessLevel: 1
        },
        query: {
            key: process.env.LOGS_KEY
        }

    }
    it('should be opened with status 200 and send users', async () => {
        await getUsers(req, res)

        const dbQuery = { accessLevel: 0 };
        const users = await UsersModel.find(dbQuery);

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.send).toHaveBeenCalledWith(users)
    })
})