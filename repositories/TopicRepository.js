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

  findById(topicId) {
    return this.connection
      .select()
      .from('topic')
      .where('id', topicId)
      .first();
  }

  findByIdWithData(topicId) {
    return this.connection
      .column({
        topic_id: 'topic.id',
        survey_id: 'survey.id',
        question_id: 'question.id',
        alternative_id: 'alternative.id',
        topic_title: 'topic.title',
        question_description: 'question.description',
        alternative_letter: 'alternative.letter',
        alternative_description: 'alternative.description',
        alternative_value: 'alternative.value'
      })
      .from('topic')
      .leftJoin('survey', 'survey.topic_id', 'topic.id')
      .leftJoin('question', 'question.survey_id', 'survey.id')
      .leftJoin('alternative', 'alternative.question_id', 'question.id')
      .where('topic.id', topicId);
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
