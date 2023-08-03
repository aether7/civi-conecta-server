const uuid = require('uuid');
const { SurveyTypes, FeedbackStatus } = require('../constants/entities');

class FeedbackRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async findProgressByTeacher(uuid) {
    return this.connection
      .with('teacher_answers', (qb) => {
        qb
          .select('user.name')
          .count({ quantity: 'answers_by_person.id' })
          .from('answers_by_person')
          .innerJoin('user', 'answers_by_person.teacher_id', 'user.id')
          .where('answers_by_person.uuid', uuid);
      })
      .column({
        total: 'questions_quantity.quantity',
        completed_by_teacher: 'teacher_answers.quantity',
        name: 'teacher_answers.name'
      })
      .from('questions_quantity')
      .innerJoin('teacher_answers')
      .where('questions_quantity.type', SurveyTypes.TEACHER)
      .first();
  }

  async findProgressByStudent(uuid) {
    return this.connection
      .select(
        'student.name',
        'student.run'
      )
      .count({ quantity: 'answers_by_person.id' })
      .column({ total: 'questions_quantity.quantity' })
      .from('feedback_course')
      .innerJoin('feedback', 'feedback.feedback_course_id', 'feedback_course.id')
      .innerJoin('student', 'feedback.student_id', 'student.id')
      .leftJoin('answers_by_person', 'answers_by_person.student_id', 'student.id')
      .innerJoin('questions_quantity')
      .where('feedback_course.uuid', uuid)
      .where('questions_quantity.type', SurveyTypes.STUDENT)
      .groupBy('student.run')
      .orderBy('student.run');
  }

  checkStatusByTeacherAlias(aliasId) {
    return this.connection
      .column({
        uuid: 'feedback_course.uuid',
        is_finished: 'feedback_course.is_finished',
        created_at: 'feedback_course.created_at',
        teacher_finished: 'feedback.is_finished'
      })
      .from('feedback_course')
      .innerJoin('feedback', 'feedback.feedback_course_id', 'feedback_course.id')
      .innerJoin('user', 'feedback.teacher_id', 'user.id')
      .where('user.uuid', aliasId)
      .first();
  }

  async checkStudentStatusByTeacherAlias(aliasId) {
    const query = `
      SELECT
        COUNT(feedback.id) as quantity,
        'no' as completed
      FROM feedback
      INNER JOIN feedback_course ON feedback.feedback_course_id = feedback_course.id
      INNER JOIN course ON feedback_course.course_id = course.id
      INNER JOIN public.user ON course.teacher_id = public.user.id
      WHERE
        public.user.uuid = ? AND
        feedback.student_id IS NOT NULL AND
        feedback.is_finished = ?
      UNION
      SELECT
        COUNT(feedback.id) as quantity,
        'yes' as completed
      FROM feedback
      INNER JOIN feedback_course ON feedback.feedback_course_id = feedback_course.id
      INNER JOIN course ON feedback_course.course_id = course.id
      INNER JOIN public.user ON course.teacher_id = public.user.id
      WHERE
        public.user.uuid = ? AND
        feedback.student_id IS NOT NULL AND
        feedback.is_finished = ?
    `;

    const results = await this.connection.raw(query, [
      aliasId,
      FeedbackStatus.NOT_FINISHED,
      aliasId,
      FeedbackStatus.FINISHED
    ]);

    const rows = results.rows;
    return rows;
  }

  findByTypeAndAlias(type, alias) {
    const builder = this.connection
      .select('feedback.*', 'feedback_course.uuid')
      .from('feedback')
      .innerJoin('feedback_course', 'feedback.feedback_course_id', 'feedback_course.id');

    if (type === SurveyTypes.STUDENT) {
      builder.innerJoin('student', 'feedback.student_id', 'student.id');
      builder.where('student.uuid', alias);
    } else {
      builder.innerJoin('user', 'feedback.teacher_id', 'user.id');
      builder.where('user.uuid', alias);
    }

    return builder.first();
  }

  findBySurveyAliasAndTypeAndAlias(surveyAlias, type, userAlias) {
    const builder = this.connection
      .select('feedback.*')
      .from('feedback_course')
      .innerJoin('feedback', 'feedback.feedback_course_id', 'feedback_course.id');

    if (type === SurveyTypes.TEACHER) {
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

  async finishSurvey(surveyType, uuid) {
    const personId = await this._getPersonId(surveyType, uuid);
    const lookupField = surveyType === SurveyTypes.TEACHER ? 'teacher_id' : 'student_id';

    return this.connection('feedback')
      .where(lookupField, personId)
      .update('is_finished', FeedbackStatus.FINISHED);
  }

  async checkCurrentSurveyCompletion(uuid) {
    return this.connection
      .column({
        quantity: this.connection.raw('COUNT(feedback.id)'),
        is_finished: this.connection.raw("CASE feedback.is_finished WHEN 1 THEN 'yes' ELSE 'no' END")
      })
      .from('feedback_course')
      .leftJoin('feedback', 'feedback_course.id', 'feedback.feedback_course_id')
      .where('feedback_course.uuid', uuid)
      .groupBy('feedback.is_finished');
  }

  async finishSurveyCompletely(uuid) {
    const feedbackCourse = await this.connection
      .select('id')
      .from('feedback_course')
      .where('uuid', uuid)
      .first();

    return this._closeSurvey(feedbackCourse.id);
  }

  async _closeSurvey(id) {
    await this.connection('feedback')
      .where('feedback_course_id', id)
      .update('is_finished', FeedbackStatus.FINISHED);

    return this.connection('feedback_course')
      .where('id', id)
      .update('is_finished', FeedbackStatus.FINISHED);
  }

  async _getPersonId(surveyType, uuid) {
    const tableName = surveyType === SurveyTypes.TEACHER ? 'user' : 'student';
    const result = await this.connection
      .select()
      .from(tableName)
      .where('uuid', uuid)
      .first();

    return result.id;
  }

  checkStudentStatusByRut(rut) {
    return this.connection
      .select('feedback.*')
      .from('student')
      .innerJoin('feedback', 'feedback.student_id', 'student.id')
      .where('student.run', rut)
      .orderBy('feedback.id', 'desc')
      .first();
  }
}

module.exports = FeedbackRepository;
