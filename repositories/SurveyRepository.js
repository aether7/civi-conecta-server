class SurveyRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async findAll() {
    return this.connection
      .column({
        id: 'survey.id',
        questionId: 'question.id',
        question: 'question.description',
        letter: 'alternative.letter',
        alternative: 'alternative.description',
        value: 'alternative.value'
      })
      .from('survey')
      .innerJoin('question', 'question.survey_id', 'survey.id')
      .innerJoin('alternative', 'alternative.question_id', 'question.id')
      .debug();
  }

  async findOrCreate(type, topicId) {
    const entity = await this.findById(type, topicId);

    if (entity) {
      return entity;
    }

    return this.create(type, topicId);
  }

  findById(type, topicId) {
    return this.connection
      .select()
      .from('survey')
      .where('type', type)
      .where('topic_id', topicId)
      .first();
  }

  async create(type, topicId) {
    const fields = {
      type,
      topic_id: topicId
    };

    const [entity] = await this.connection
      .insert(fields, ['*'])
      .into('survey');

    return entity;
  }
}

module.exports = SurveyRepository;
