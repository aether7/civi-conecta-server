const uuid = require('uuid');
const { SurveyTypes } = require('../constants/entities');

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
      .where('questions_quantity.type', 'teacher')
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
      .where('questions_quantity.type', 'student')
      .groupBy('student.run')
      .orderBy('student.run');
  }

  async checkStatusByTeacherAlias(aliasId) {
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

  async createByType(type, alias) {
    if (type === SurveyTypes.STUDENT) {
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
}

module.exports = FeedbackRepository;
