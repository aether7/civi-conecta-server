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

  findByIdWithData(topicId, surveyType) {
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
      .where('topic.id', topicId)
      .where('survey.type', surveyType);
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

  async groupAssociatedQuestions(topicId) {
    const results = await this.connection
      .select('survey.type')
      .count({ quantity: 'question.id' })
      .from('topic')
      .innerJoin('survey', 'survey.topic_id', 'topic.id')
      .innerJoin('question', 'question.survey_id', 'survey.id')
      .where('topic.id', topicId)
      .groupBy('survey.type');

    const groupQty = { student: 0, teacher: 0 };

    if (!results.length) {
      return groupQty;
    }

    return results.reduce((obj, item) => ({
      ...obj,
      [item.type]: item.quantity
    }), groupQty);
  }

  deleteById(topicId) {
    return this.connection('topic')
      .where('id', topicId)
      .del();
  }
}

module.exports = TopicRepository;
