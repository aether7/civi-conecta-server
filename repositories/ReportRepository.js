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
      .from('student')
      .innerJoin('feedback', 'feedback.student_id', 'student.id')
      .innerJoin('feedback_course', 'feedback.feedback_course_id', 'feedback_course.id')
      .leftJoin('answer', 'answer.feedback_id', 'feedback.id')
      .where('feedback_course.course_id', courseId)
      .groupBy('student.run', 'student.name')
      .orderBy('student.run');
  }

  getStudentAnswers(teacherUUID, questionId) {
    const builder = this.connection
      .column({
        topic_name: 'topic.title',
        question_description: 'question.description',
        answer_description: 'alternative.description'
      })
      .count({ quantity: 'answer.id' })
      .from('question')
      .innerJoin('topic', 'question.topic_id', 'topic.id')
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
      .groupBy('topic.id', 'question.id', 'alternative.id')
      .orderBy(['topic.id', 'question.id', 'alternative.id']);

    return builder;
  }

  getMostCriticalStudentAnswers(teacherUUID) {
    return this.connection
      .column({
        topic_name: 'topic.title',
        question_id: 'question.id',
        question_description: 'question.description'
      })
      .avg({ average: 'alternative.value' })
      .from('question')
      .innerJoin('topic', 'question.topic_id', 'topic.id')
      .innerJoin('alternative', 'alternative.question_id', 'question.id')
      .innerJoin('answer', 'answer.alternative_id', 'alternative.id')
      .innerJoin('feedback', 'answer.feedback_id', 'feedback.id')
      .innerJoin('feedback_course', 'feedback.feedback_course_id', 'feedback_course.id')
      .innerJoin('course', 'feedback_course.course_id', 'course.id')
      .innerJoin('public.user', 'course.teacher_id', 'public.user.id')
      .where('public.user.uuid', teacherUUID)
      .where('question.is_for_student', 1)
      .groupBy('topic.title', 'question.id')
      .orderBy([
        {column: 'average', order: 'desc'},
        {column: 'question.id'}
      ])
      .limit(3);
  }

  async getUnitOrder(teacherUUID) {
    const [teacherResults, studentResults] = await Promise.all([
      this._findUnitResults(teacherUUID, 0),
      this._findUnitResults(teacherUUID, 1)
    ]);

    return { teacherResults, studentResults };
  }

  _findUnitResults(teacherUUID, isForStudent) {
    return this.connection
      .column({
        title: 'topic.title',
        unit_id: 'unit.id',
      })
      .avg({ unit_order: 'alternative.value' })
      .from('topic')
      .innerJoin('unit', 'topic.id', 'unit.topic_id')
      .innerJoin('question', 'question.topic_id', 'topic.id')
      .innerJoin('alternative', 'alternative.question_id ', 'question.id')
      .innerJoin('answer', 'answer.alternative_id', 'alternative.id')
      .innerJoin('feedback', 'answer.feedback_id', 'feedback.id')
      .innerJoin('feedback_course', 'feedback.feedback_course_id', 'feedback_course.id')
      .innerJoin('course', 'feedback_course.course_id', 'course.id')
      .innerJoin('public.user', 'course.teacher_id', 'public.user.id')
      .where('question.is_for_student', isForStudent)
      .where('public.user.uuid', teacherUUID)
      .groupBy('topic.id', 'unit.id')
      .orderBy('unit.id');
  }
}

module.exports = ReportRepository;
