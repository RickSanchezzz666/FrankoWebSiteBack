const { login } = require('../../controllers/usersController/login')
const { UsersModel } = require('../../models/usersModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

describe('login', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongoose was connected');

        const salt = await bcrypt.genSalt(10)
        const encryptedpassword = await bcrypt.hash('admin', salt)
        

        await UsersModel.insertMany([{
            login: 'admin0',
            password: encryptedpassword,
            fullName: "FullAdmin",
            accessLevel: 0
        }])
        
    });

    afterAll(async () => {
        await UsersModel.deleteMany();
    })

    describe('should be opened', () => {
        const res = {
            send: jest.fn(),
            status: jest.fn().mockImplementation(() => res)

        }

        it('throw error 400 and message login', async () => {
            const req = {
                user: {
                    accessLevel: 1,
                    fullName: "Tommy",
                },
                body: {
                    login: "admin",
                    password: "admin"
                },
                query: {
                    key: process.env.LOGS_KEY
                }
            }

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({ message: 'Хибний логін або пароль' })    
        })

        it('throw error 400 and message pass', async () => {
            const req = {
                user: {
                    accessLevel: 1,
                    fullName: "Tommy",
                },
                body: {
                    login: "admin0",
                    password: "admi"
                },
                query: {
                    key: process.env.LOGS_KEY
                }
            }

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.send).toHaveBeenCalledWith({ message: 'Хибний логін або пароль' })    
        })

        it('throw error 200 and send token', async () => {
            const req = {
                user: {
                    accessLevel: 1,
                    fullName: "Tommy",
                },
                body: {
                    login: "admin0",
                    password: "admin"
                },
                query: {
                    key: process.env.LOGS_KEY
                }
            }

            const user = await UsersModel.findOne({ login: "admin0" });

            const token = jwt.sign(
                {
                    _id: user._id,
                    login: user.login
                },
                process.env.JWT_KEY,
                { expiresIn: process.env.JWT_EXPIRES_IN_HOURS * 60 * 60 });
    

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith({ token })    
        })
    })

})