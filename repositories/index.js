const EstablishmentRepository = require('./EstablishmentRepository');
const UserRepository = require('./UserRepository');

module.exports = {
  establishment: new EstablishmentRepository(),
  user: new UserRepository()
};
