const EmailService = require('./EmailService');
const TokenService = require('./TokenService');

const services = {
  email: new EmailService(),
  token: new TokenService()
};

module.exports = services;
