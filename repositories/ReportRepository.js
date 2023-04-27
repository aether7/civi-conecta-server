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
        question_description: 'question.description',
        answer_description: 'alternative.value',
        average: this.connection.raw('AVG(alternative.value) OVER(PARTITION BY question.id)')
      })
      .from('question')
      .innerJoin('topic', 'question.topic_id', 'topic.id')
      .innerJoin('alternative', 'alternative.question_id', 'question.id')
      .innerJoin('answer', 'answer.alternative_id', 'alternative.id')
      .innerJoin('feedback', 'answer.feedback_id', 'feedback.id')
      .innerJoin('feedback_course', 'feedback.feedback_course_id', 'feedback_course.id')
      .innerJoin('course', 'feedback_course.course_id', 'course.id')
      .innerJoin('public.user', 'course.teacher_id', 'public.user.id')
      .where('public.user.uuid', teacherUUID)
      .orderBy([
        {column: 'average', order: 'desc'},
        {column: 'question.id'}
      ])
      .limit(3);
  }
}

module.exports = ReportRepository;
