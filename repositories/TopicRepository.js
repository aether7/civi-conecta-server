const { EntityNotFoundError } = require('./exceptions');

class TopicRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findAll() {
    return this.connection
      .select()
      .from('topic')
      .orderBy('id');
  }

  async findOneByNumber(number) {
    const entity = await this.connection
      .select()
      .from('topic')
      .where('number', number)
      .first();

    if (!entity) {
      throw new EntityNotFoundError(`El tema #${number} no existe`);
    }

    return entity;
  }

  async create(title, number) {
    const [result] = await this.connection
      .insert({ title, number }, ['*'])
      .into('topic');

    return result;
  }
}

module.exports = TopicRepository;
