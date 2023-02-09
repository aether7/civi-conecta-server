require('dotenv').config();

const config = require('./config');
const pino = require('pino');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const logger = pino({ level: config.env.logLevel });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: true }));
app.use(fileUpload({ createParentPath: true }));
app.use((req, _, next) => {
  req.logger = logger;
  next();
});
app.use(require('./routes'));
require('./database')(config.database.mongo.url, logger);

app.listen(config.env.port, config.env.host, (...args) => {
  logger.info(`server running at http://${config.env.host}:${config.env.port}`);
});
