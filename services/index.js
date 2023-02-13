const WorkplaceService = require('./WorkplaceService');
const EmailService = require('./EmailService');
const TokenService = require('./TokenService');
const PasswordService = require('./PasswordService');

const services = {
  workplace: new WorkplaceService(),
  email: new EmailService(),
  token: new TokenService(),
  password: new PasswordService()
};

module.exports = services;
