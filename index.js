require('dotenv').config();

const config = require('./config');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const pino = require('pino');
const errorHandlers = require('./middlewares/handleErrors');
const app = express();

const multistream = pino.multistream;
const streams = [
  { level: config.env.logLevel, stream: process.stdout },
  { level: 'error', stream: process.stderr }
];
const logger = pino({ level: config.env.logLevel }, multistream(streams));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true }));

app.use(require('./middlewares/addLogger')(logger));
app.use(require('./middlewares/logRoute'));
app.use(require('./routes'));

app.use(errorHandlers.handleNotFound);
app.use(errorHandlers.handleServerError);

if (config.env.mustShowRoutes) {
  const listEndpoints = require('express-list-endpoints');
  console.info(listEndpoints(app));
}

app.listen(config.env.port, config.env.host, () => {
  process.stdout.write(`server running at http://${config.env.host}:${config.env.port}\n`);
  logger.info(`server running at http://${config.env.host}:${config.env.port}`);
});
