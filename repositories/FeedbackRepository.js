const uuid = require('uuid');

class FeedbackRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async checkStatusByTeacherAlias(aliasId) {
    return this.connection
      .with('students_feedback', (qb) => {
        qb.select().from('feedback').whereNot('student_id', null);
      })
      .column({
        uuid: 'feedback_course.uuid',
        is_finished: 'feedback_course.is_finished',
        created_at: 'feedback_course.created_at',
        teacher_finished: 'feedback.is_finished'
      })
      .count({ student_surveys_qty: 'students_feedback.id' })
      .from('feedback_course')
      .innerJoin('feedback', 'feedback.feedback_course_id', 'feedback_course.id')
      .innerJoin('user', 'feedback.teacher_id', 'user.id')
      .leftJoin('students_feedback', 'students_feedback.feedback_course_id', 'feedback_course.id')
      .where('user.uuid', aliasId)
      .first();
  }

  findByTypeAndAlias(type, alias) {
    const builder = this.connection
      .select('feedback.*', 'feedback_course.uuid')
      .from('feedback')
      .innerJoin('feedback_course', 'feedback.feedback_course_id', 'feedback_course.id');

    if (type === 'student') {
      builder.innerJoin('student', 'feedback.student_id', 'student.id');
      builder.where('student.uuid', alias);
    } else {
      builder.innerJoin('user', 'feedback.teacher_id', 'user.id');
      builder.where('user.uuid', alias);
    }

    builder.first();
    return builder;
  }

  async createByType(type, alias) {
    if (type === 'student') {
      return this._createStudentFeedback(alias);
    }

    return this._createTeacherFeedback(alias);
  }

  async _createStudentFeedback(alias) {
    const result = await this.connection
      .select('id')
      .from('student')
      .where('uuid', alias)
      .first();

    const fields = {
      student_id: result.id,
      is_finished: 0
    };

    return this.connection.insert(fields, ['*']).into('feedback');
  }

  async _createTeacherFeedback(alias) {
    const [courseFeedback] = await this.connection
      .insert({
        uuid: uuid.v4(),
        is_finished: 0
      }, ['*'])
      .into('feedback_course');

    const teacher = await this.connection
      .select('id')
      .from('user')
      .where('uuid', alias)
      .first();

    return this.connection
      .insert({
        feedback_course_id: courseFeedback.id,
        teacher_id: teacher.id,
        is_finished: 0
      }, ['*'])
      .into('feedback');
  }

  findBySurveyAliasAndTypeAndAlias(surveyAlias, type, userAlias) {
    const builder = this.connection
      .select('feedback.*')
      .from('feedback_course')
      .innerJoin('feedback', 'feedback.feedback_course_id', 'feedback_course.id');

    if (type === 'teacher') {
      builder.innerJoin('user', 'feedback.teacher_id', 'user.id');
      builder.where('user.uuid', userAlias);
    } else {
      builder.innerJoin('student', 'feedback.student_id', 'student.id');
      builder.where('student.uuid', userAlias);
    }

    return builder
      .where('feedback_course.uuid', surveyAlias)
      .first();
  }
}

module.exports = FeedbackRepository;
