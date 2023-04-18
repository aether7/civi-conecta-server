const uuid = require('uuid');

class StudentRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async findOrCreate(student) {
    const result = await this.findByRun(student.run);

    if (result) {
      return result;
    }

    return this.create(student);
  }

  findByRun(run) {
    return this.connection
      .select()
      .from('student')
      .where('run', run)
      .first();
  }

  async create(student) {
    const fields = {
      name: student.name,
      run: student.run,
      uuid: uuid.v4()
    };

    const [result] = await this.connection
      .insert(fields, ['*'])
      .into('student');

    return result;
  }

  async findByCourse(courseId) {
    return this.connection
      .select('student.*')
      .from('student')
      .innerJoin('course_student', 'course_student.student_id', 'student.id')
      .innerJoin('course', 'course_student.course_id', 'course.id')
      .where('course.id', courseId);
  }
}

module.exports = StudentRepository;
