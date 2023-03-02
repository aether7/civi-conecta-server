class QuestionRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async create({ description, topicId }) {
    const fields = {
      description,
      topic_id: topicId
    };

    const [entity] = await this.connection
      .insert(fields, ['*'])
      .into('question');

    return entity;
  }

  deleteById(id) {
    return this.connection('question')
      .where('id', id)
      .del();
  }
}

module.exports = QuestionRepository;
