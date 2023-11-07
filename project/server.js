const express = require('express');
const app = express();
const Mongo = require('./setup/mongoose');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const cors = require('cors');
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT;

const setup = async () => {
    await Mongo.setupDb(process.env.MONGO_DB_URI);
    
    server.listen(PORT, () => {
        console.log(`Server started on ${PORT}`)
    })
};

module.exports = setup();