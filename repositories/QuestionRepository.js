class QuestionRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async create({ description, surveyId }) {
    const fields = {
      description,
      survey_id: surveyId
    };

    const [entity] = await this.connection
      .insert(fields, ['*'])
      .into('question');

    return entity;
  }
}

module.exports = QuestionRepository;
