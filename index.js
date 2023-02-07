require('dotenv').config();
require('./config');

const pino = require('pino');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const logger = pino({level: process.env.PINO_LOG_LEVEL});

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
require('./database')(logger);

app.listen(process.env.PORT, () => {
  logger.info(`server running at http://127.0.0.1:${process.env.PORT}`);
});
