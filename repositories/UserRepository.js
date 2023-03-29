const uuid = require('uuid');
const { EntityNotFoundError } = require('./exceptions');
const passwordHelper = require('../helpers/password');
const { RoleTypes } = require('../constants/entities');

class UserRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async findOrCreateUser({ name, email }) {
    try {
      const entity = await this.findOneByEmail(email);
      return entity;
    } catch (err) {
      const password = await passwordHelper.createRandomPassword();
      const entity = await this.createUser({ name, email, password });
      return entity;
    }
  }

  async findOneByEmail(email) {
    const entity = await this.connection.select()
      .from('user')
      .where('email', email)
      .where('active', 1)
      .first();

    if (!entity) {
      throw new EntityNotFoundError(`No existe el usuario activo con el correo ${email}`);
    }

    return entity;
  }

  async createAdmin({ email, name, password }) {
    const fields = {
      uuid: uuid.v4(),
      email,
      name,
      password: passwordHelper.encrypt(password),
      encrypted_password: 1,
      active: 1,
      role: RoleTypes.ADMIN
    };

    const [user] = await this.connection.insert(fields, ['*']).into('user');
    return user;
  }

  async createUser({ email, name, password }) {
    const fields = {
      uuid: uuid.v4(),
      email,
      name,
      password,
      encrypted_password: 0,
      active: 1,
      role: RoleTypes.USER
    };

    const [user] = await this.connection.insert(fields, ['*']).into('user');
    return user;
  }

  async updatePassword(userId, password) {
    const fields = {
      encrypted_password: 1,
      updated_at: new Date(),
      password: passwordHelper.encrypt(password)
    };

    return this.connection('user')
      .where('id', userId)
      .update(fields);
  }

  findByAlias(uuid) {
    return this.connection
      .select()
      .from('user')
      .where('uuid', uuid)
      .first();
  }
}

module.exports = UserRepository;
