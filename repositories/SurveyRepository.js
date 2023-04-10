const { SurveyTypes } = require('../constants/entities');

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
    const isForStudent = type === 'teacher' ? 0 : 1;

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
      .from('topic')
      .innerJoin('question', 'question.topic_id', 'topic.id')
      .innerJoin('alternative', 'alternative.question_id', 'question.id')
      .leftJoin('answer', 'answer.alternative_id', 'alternative.id')
      .leftJoin('feedback', 'answer.feedback_id', 'feedback.id')
      .where('question.is_for_student', isForStudent)
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

  async getReportForSomething(courseId) {
    return this.connection
      .column({
        topic_name: 'topic.title',
        unit_title: 'unit.title',
        question_made: 'question.description',
        alternative_description: 'alternative.description',
        qty_answers: this.connection.raw('COUNT(answer.id)'),
        total: this.connection.raw('COUNT(answer.id) OVER(PARTITION BY question.description)')
      })
      .from('survey')
      .innerJoin('topic', 'survey.id', 'topic.survey_id')
      .innerJoin('unit', 'topic.id', 'unit.topic_id')
      .innerJoin('question', 'topic.id', 'question.topic_id')
      .innerJoin('alternative', 'question.id', 'alternative.question_id')
      .leftJoin('answer', 'answer.alternative_id', 'alternative.id')
      .leftJoin('feedback', 'answer.feedback_id', 'feedback.id')
      .leftJoin('feedback_course', 'feedback.feedback_course_id', 'feedback_course.id')
      .leftJoin('course', 'feedback_course.course_id', 'course.id')
      .leftJoin('grade', 'course.grade_id', 'grade.id')
      .where('survey.id', SurveyTypes.STUDENT_ID)
      .whereRaw('(course.id = ? OR course.id IS NULL)', [courseId])
      .groupBy(
        'topic_name',
        'unit_title',
        'question_made',
        'answer.id',
        'alternative_description'
      );
  }
}

module.exports = SurveyRepository;
