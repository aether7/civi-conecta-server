class CourseStudentRepository {
  constructor(connection) {
    this.connection = connection;
  }

  deleteByCourseId(courseId) {
    return this.connection('course_student')
      .where('course_id', courseId)
      .del();
  }
}

module.exports = CourseStudentRepository;
