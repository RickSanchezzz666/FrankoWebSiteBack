const { stopMongoMemoryServer } = require('./mongodb-memory')

module.exports = async () => {
    console.log('MongoDB server teardown was started!');
    await stopMongoMemoryServer();
    console.log('MongoDB server was stopped!')
}