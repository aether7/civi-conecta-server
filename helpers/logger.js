const { createLogger, format, transports } = require('winston');
const config = require('../config');


const logger = createLogger({
  level: config.env.logLevel,
  format: format.combine(
    format.splat(),
    format.simple()
  ),
  transports: [
    new transports.Console()
  ]
});

module.exports = logger;
