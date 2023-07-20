class ReportRepository {
  constructor(connection) {
    this.connection = connection;
  }

  getStudentCompletionReport(courseId) {
    const subquery = this.connection
      .count('question.id')
      .from('question')
      .where('is_for_student', 1)
      .as('question_count');

    return this.connection
      .select('student.run', 'student.name', subquery)
      .count({ answers: 'answer.id' })
      .from('course')
      .innerJoin('course_student', 'course.id', 'course_student.course_id')
      .innerJoin('student', 'course_student.student_id', 'student.id')
      .innerJoin('feedback', 'feedback.student_id', 'student.id')
      .innerJoin('feedback_course', 'feedback.feedback_course_id', 'feedback_course.id')
      .leftJoin('answer', 'answer.feedback_id', 'feedback.id')
      .where('course.id', courseId)
      .groupBy('student.run', 'student.name')
      .orderBy('student.run');
  }

  getStudentAnswers(teacherUUID, questionId) {
    const builder = this.connection
      .column({
        topic_name: 'unit.title',
        question_description: 'question.description',
        answer_description: 'alternative.description'
      })
      .count({ quantity: 'answer.id' })
      .from('question')
      .innerJoin('unit', 'question.unit_id', 'unit.id')
      .innerJoin('alternative', 'alternative.question_id', 'question.id')
      .innerJoin('answer', 'answer.alternative_id', 'alternative.id')
      .innerJoin('feedback', 'answer.feedback_id', 'feedback.id')
      .innerJoin('feedback_course', 'feedback.feedback_course_id', 'feedback_course.id')
      .innerJoin('course', 'feedback_course.course_id', 'course.id')
      .innerJoin('public.user', 'course.teacher_id', 'public.user.id')
      .where('public.user.uuid', teacherUUID)
      .where('question.is_for_student', 1);

    if (questionId) {
      builder.where('question.id', questionId);
    }

    builder
      .groupBy('unit.id', 'question.id', 'alternative.id')
      .orderBy(['unit.id', 'question.id', 'alternative.id']);

    return builder;
  }

  getMostCriticalStudentAnswers(teacherUUID) {
    return this.connection
      .column({
        topic_name: 'unit.title',
        question_id: 'question.id',
        question_description: 'question.description'
      })
      .avg({ average: 'alternative.value' })
      .from('question')
      .innerJoin('unit', 'question.unit_id', 'unit.id')
      .innerJoin('alternative', 'alternative.question_id', 'question.id')
      .innerJoin('answer', 'answer.alternative_id', 'alternative.id')
      .innerJoin('feedback', 'answer.feedback_id', 'feedback.id')
      .innerJoin('feedback_course', 'feedback.feedback_course_id', 'feedback_course.id')
      .innerJoin('course', 'feedback_course.course_id', 'course.id')
      .innerJoin('public.user', 'course.teacher_id', 'public.user.id')
      .where('public.user.uuid', teacherUUID)
      .where('question.is_for_student', 1)
      .groupBy('unit.title', 'question.id')
      .orderBy([
        {column: 'average', order: 'desc'},
        {column: 'question.id'}
      ])
      .limit(3);
  }

  async getUnitOrder(courseId) {
    const [teacherResults, studentResults] = await Promise.all([
      this._findUnitResults(courseId, 0),
      this._findUnitResults(courseId, 1)
    ]);

    return { teacherResults, studentResults };
  }

  _findUnitResults(courseId, isForStudent) {
    return this.connection
      .column({
        unit_title: 'unit.title',
        unit_id: 'unit.id'
      })
      .avg({ unit_order: 'alternative.value' })
      .from('course')
      .innerJoin('course_unit', 'course.id', 'course_unit.course_id')
      .innerJoin('unit', 'course_unit.unit_id', 'unit.id')
      .innerJoin('question', 'question.unit_id', 'unit.id')
      .innerJoin('alternative', 'alternative.question_id', 'question.id')
      .innerJoin('answer', 'answer.alternative_id', 'alternative.id')
      .where('course.id', courseId)
      .where('question.is_for_student', isForStudent)
      .groupBy('unit.id')
      .orderBy([
        { column: 'unit_order', order: 'desc' },
        { column: 'unit.id', order: 'asc' }
      ]);
  }
}

module.exports = ReportRepository;
