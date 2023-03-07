const config = require('../config');
const EmailService = require('./EmailService');
const TokenService = require('./TokenService');
const FTPService = require('./FTPService');
const TempFileService = require('./TempFileService');

const services = {
  email: new EmailService(),
  token: new TokenService(),
  ftp: new FTPService(config.ftp.rootFolder, config.ftp),
  tempfile: new TempFileService()
};

module.exports = services;
