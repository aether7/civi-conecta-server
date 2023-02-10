const Topics = require('../models/topics');
const { EntityNotFoundError } = require('./exceptions');

class TopicRepository {
  async findOneByNumber(number) {
    const entity = Topics.findOne({ number });

    if (!entity) {
      throw new EntityNotFoundError(`El tema #${number} no existe`);
    }

    return entity;
  }
}

module.exports = TopicRepository;
