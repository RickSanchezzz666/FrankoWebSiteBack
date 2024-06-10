const {auth} = require  ('../../controllers/usersController/auth')
const { UsersModel } = require('../../models/usersModel');

const mongoose = require('mongoose');

describe('auth', () => {
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
        json: jest.fn(),
        status: jest.fn().mockImplementation(() => res)

    }

    const login = "Admin"
    const fullName = "Lanosovich"
    const accessLevel = 0

    const req = {
        user: {
            login,
            fullName,
            accessLevel
        }

    }
    it('should be opened with status 200 and send user data', async () => {
        await auth(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ login, fullName, accessLevel })
    })
})