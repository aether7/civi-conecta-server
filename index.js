require('dotenv').config();

const config = require('./config');
const pino = require('pino');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const errorHandlers = require('./middlewares/handleErrors');
const app = express();
const logger = pino({ level: config.env.logLevel });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true }));

app.use(require('./middlewares/addLogger')(logger));
app.use(require('./middlewares/logRoute'));
app.use(require('./routes'));

app.use(errorHandlers.handleNotFound);
app.use(errorHandlers.handleServerError);

app.listen(config.env.port, config.env.host, () => {
  logger.info(`server running at http://${config.env.host}:${config.env.port}`);
});
