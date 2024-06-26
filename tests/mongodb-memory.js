const { MongoMemoryServer } = require('mongodb-memory-server')

/**
 * @type {MongoMemoryServer}
 */
let instance;

module.exports.createMongoMemoryServer = async () => {
    instance = await MongoMemoryServer.create()

    const url = instance.getUri();

    process.env.MONGO_DB_URI = url;
    console.log(`MONGO_DB_URI:${process.env.MONGO_DB_URI}`);
};

module.exports.stopMongoMemoryServer = async () => {
    await instance.stop();
}