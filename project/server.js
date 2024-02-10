const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);

const Mongo = require('./config/mongoose');
const authMiddleware = require('./middlewares/authMiddleware');
const RouterAPI = require('./router/router');

require('dotenv').config({path: '../.env'});

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors({origin: "*"}));

const setup = async () => {
    await Mongo.setupDb(process.env.MONGO_DB_URI);

    authMiddleware(app);

    app.use('/api', RouterAPI.router);

    app.use((err, req, res, next) => {
        if (err.type === 'entity.too.large') {
            return res.status(413).send('Надто довгий запит');
        }
        next(err);
    });

    server.listen(PORT, () => {
        console.log(`Server started on ${PORT}`)
    });
};

module.exports = setup();