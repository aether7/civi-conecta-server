class CourseStudentRepository {
  constructor(connection) {
    this.connection = connection;
  }

  deleteByCourseId(courseId) {
    return this.connection('course_student')
      .where('course_id', courseId)
      .del();
  }

  async create({ courseId, studentId }) {
    const fields = {
      course_id: courseId,
      student_id: studentId
    };

    const [result] = await this.connection
      .insert(fields, ['*'])
      .into('course_student');

    return result;
  }
}

module.exports = CourseStudentRepository;
