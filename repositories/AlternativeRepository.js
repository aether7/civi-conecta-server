class AlternativeRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async create({ letter, description, value, questionId }) {
    const fields = {
      letter,
      description,
      value,
      question_id: questionId
    };

    const [entity] = await this.connection
      .insert(fields, ['*'])
      .into('alternative');

    return entity;
  }
}

module.exports = AlternativeRepository;
