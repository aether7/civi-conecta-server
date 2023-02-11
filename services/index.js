const WorkplaceService = require('./WorkplaceService');
const EmailService = require('./EmailService');

const services = {
  workplace: new WorkplaceService(),
  email: new EmailService()
};

module.exports = services;
