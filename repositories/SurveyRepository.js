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
      .innerJoin('alternative', 'alternative.question_id', 'question.id');
  }

  async findOne(id) {
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
      .where('survey.id', id)
      .first();
  }

  async findWithDataByType(type) {
    return this.connection
      .column({
        topic_number: 'topic.number',
        topic_title: 'topic.title',
        question_id: 'question.id',
        question_description: 'question.description',
        alternative_letter: 'alternative.letter',
        alternative_description: 'alternative.description',
        alternative_value: 'alternative.value',
        alternative_id: 'alternative.id'
      })
      .from('survey')
      .innerJoin('topic', 'topic.survey_id', 'survey.id')
      .innerJoin('question', 'question.topic_id', 'topic.id')
      .innerJoin('alternative', 'alternative.question_id', 'question.id')
      .leftJoin('answer', 'answer.alternative_id', 'alternative.id')
      .leftJoin('feedback', 'answer.feedback_id', 'feedback.id')
      .where('survey.type', type)
      .orderBy(['question.id', 'alternative.id']);
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

  findByType(type) {
    return this.connection
      .select()
      .from('survey')
      .where('type', type)
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

  deleteByTopicId(topicId) {
    return this.connection('survey')
      .where('topic_id', topicId)
      .del();
  }

  async getReportForSomething(courseId = 1) {
    const query = `
      SELECT
        topic.title as topic_name,
        question.description AS question_made,
        alternative.description AS alternative_description,
        COUNT(answer.id) over(partition BY alternative.id) AS qty_answers,
        COUNT(answer.id) over(
          partition BY question.description
        ) AS total,
        alternative.value AS alternative_value
      FROM survey
      INNER JOIN topic ON survey.id = topic.survey_id
      LEFT JOIN unit ON topic.id = unit.topic_id
      LEFT JOIN question ON question.topic_id = topic.id
      LEFT JOIN alternative ON question.id = alternative.question_id
      LEFT JOIN answer ON answer.alternative_id = alternative.id
      LEFT JOIN feedback on answer.feedback_id = feedback.id
      LEFT JOIN feedback_course on feedback.feedback_course_id = feedback_course.id
      LEFT JOIN course on course.id = feedback_course.course_id
      LEFT join grade on course.grade_id = grade.id
      WHERE survey.id = 2
      GROUP BY topic_name, question_made, alternative_description
    `;

    const results = await this.connection.raw(query);
    console.log('results', results);
    return results;
  }
}

module.exports = SurveyRepository;
