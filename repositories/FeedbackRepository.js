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
    const studentCourse = await this.connection
      .select('course_student.*')
      .from('course_student')
      .innerJoin('student', 'course_student.student_id', 'student.id')
      .where('student.uuid', alias)
      .first();

    const feedbackCourse = await this._findOrCreateCourseFeedback(studentCourse.course_id);
    const feedback = await this._findOrCreateStudentFeedback(feedbackCourse.id, studentCourse.student_id);

    return feedback;
  }

  async _createTeacherFeedback(alias) {
    const teacher = await this.connection
      .select('id')
      .from('user')
      .where('uuid', alias)
      .first();

    const course = await this.connection
      .select('course.*')
      .from('course')
      .innerJoin('user', 'course.teacher_id', 'user.id')
      .where('user.uuid', alias)
      .first();

    const courseFeedback = await this._findOrCreateCourseFeedback(course.id);
    const feedback = await this._findOrCreateTeacherFeedback(courseFeedback.id, teacher.id);

    return feedback;
  }

  async _findOrCreateCourseFeedback(courseId) {
    let courseFeedback = await this.connection
      .select()
      .from('feedback_course')
      .where('course_id', courseId)
      .first();

    if (courseFeedback) {
      return courseFeedback;
    }

    const fields = {
      uuid: uuid.v4(),
      is_finished: FeedbackStatus.NOT_FINISHED,
      course_id: courseId
    };

    [courseFeedback] = await this.connection
      .insert(fields, ['*'])
      .into('feedback_course');

    return courseFeedback;
  }

  async _findOrCreateTeacherFeedback(courseFeedbackId, teacherId) {
    let feedback = await this.connection
      .select()
      .from('feedback')
      .where('teacher_id', teacherId)
      .where('is_finished', FeedbackStatus.NOT_FINISHED)
      .first();

    if (feedback) {
      return feedback;
    }

    const fields = {
      feedback_course_id: courseFeedbackId,
      teacher_id: teacherId,
      is_finished: FeedbackStatus.NOT_FINISHED
    };

    [feedback] = await this.connection
      .insert(fields, ['*'])
      .into('feedback');

    return feedback;
  }

  async _findOrCreateStudentFeedback(feedbackCourseId, studentId) {
    let feedback = await this.connection
      .select()
      .from('feedback')
      .where('student_id', studentId)
      .where('is_finished', FeedbackStatus.NOT_FINISHED)
      .first();

    if (feedback) {
      return feedback;
    }

    const fields = {
      student_id: studentId,
      is_finished: FeedbackStatus.NOT_FINISHED,
      feedback_course_id: feedbackCourseId
    };

    [feedback] = await this.connection
      .insert(fields, ['*'])
      .into('feedback');

    return feedback;
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
}

module.exports = FeedbackRepository;
