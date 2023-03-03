const config = require('../config');
const EmailService = require('./EmailService');
const TokenService = require('./TokenService');
const PasswordService = require('./PasswordService');
const FTPService = require('./FTPService');
const TempFileService = require('./TempFileService');

const services = {
  email: new EmailService(),
  token: new TokenService(),
  password: new PasswordService(),
  ftp: new FTPService(config.ftp.rootFolder, config.ftp),
  tempfile: new TempFileService()
};

module.exports = services;
