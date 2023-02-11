const Users = require('../models/users');
const { EntityNotFoundError } = require('./exceptions');

class UserRepository {
  async findOneByEmail(email) {
    const entity = await Users.findOne({ email, active: true });

    if (!entity) {
      throw new EntityNotFoundError(`No existe el usuario activo con el correo ${email}`);
    }

    return entity;
  }
}

module.exports = UserRepository;
