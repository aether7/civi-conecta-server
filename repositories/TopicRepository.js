class TopicRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findBySurveyType(surveyType = 'all') {
    const builder = this.connection
      .select('topic.*')
      .from('topic')
      .innerJoin('survey', 'topic.survey_id', 'survey.id');

    if (surveyType !== 'all') {
      builder.where('survey.type', surveyType);
    }

    builder.orderBy('topic.id');

    return builder;
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

  async countAssociatedQuestionsByTopicId(topicId) {
    const results = await this.connection
      .count({ quantity: 'question.id' })
      .from('question')
      .where('topic_id', topicId)
      .first();

    return Number.parseInt(results.quantity);
  }

  deleteById(topicId) {
    return this.connection('topic')
      .where('id', topicId)
      .del();
  }
}

module.exports = TopicRepository;
