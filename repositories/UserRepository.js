const { EntityNotFoundError } = require('./exceptions');

class UserRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async findOneByEmail(email) {
    const entity = await this.connection.select()
      .from('user')
      .where('email', email)
      .where('active', true)
      .first();

    if (!entity) {
      throw new EntityNotFoundError(`No existe el usuario activo con el correo ${email}`);
    }

    return entity;
  }
}

module.exports = UserRepository;
