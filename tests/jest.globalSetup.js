require('dotenv').config({ path: './testEnv/.env.test' })
const { createMongoMemoryServer } = require('./mongodb-memory')

module.exports = async () => {
    console.log('Start creating MongoDB Server!');
    await createMongoMemoryServer();
    console.log('MongoDB server was created!')
} 