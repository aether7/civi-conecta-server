class TopicRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findBySurveyType(surveyType) {
    return this.connection
      .select('topic.*')
      .from('topic')
      .innerJoin('survey', 'topic.survey_id', 'survey.id')
      .where('survey.type', surveyType)
      .orderBy('topic.id');
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
        topic_title: 'topic.title',
        question_id: 'question.id',
        alternative_id: 'alternative.id',
        question_description: 'question.description',
        alternative_letter: 'alternative.letter',
        alternative_description: 'alternative.description',
        alternative_value: 'alternative.value'
      })
      .from('topic')
      .leftJoin('question', 'question.topic_id', 'topic.id')
      .leftJoin('alternative', 'alternative.question_id', 'question.id')
      .where('topic.id', topicId);
  }

  _calculateNumber(surveyId) {
    return this.connection
      .select(this.connection.raw('COALESCE(MAX(number), 0) as number'))
      .from('topic')
      .where('survey_id', surveyId)
      .first();
  }

  async create(title, surveyId) {
    const numberResult = await this._calculateNumber(surveyId);

    const fields = {
      title,
      number: numberResult.number,
      survey_id: surveyId
    };

    const [result] = await this.connection
      .insert(fields, ['*'])
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
