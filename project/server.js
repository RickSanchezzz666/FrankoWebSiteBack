const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);

const Mongo = require('./config/mongoose');
const authMiddleware = require('./middlewares/authMiddleware');
const RouterAPI = require('./router/router');

require('dotenv').config();

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

const setup = async () => {
    await Mongo.setupDb(process.env.MONGO_DB_URI);

    app.use('/api', RouterAPI.router);
    authMiddleware(app);

    server.listen(PORT, () => {
        console.log(`Server started on ${PORT}`)
    });
};

module.exports = setup();