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

  deleteById(id) {
    return this.connection('question')
      .where('id', id)
      .del();
  }
}

module.exports = QuestionRepository;
