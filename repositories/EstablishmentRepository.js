class EstablishmentRepository {
  constructor(connection, { courseRepository, courseStudentRepository, studentRepository }) {
    this.connection = connection;
    this.courseRepository = courseRepository;
    this.courseStudentRepository = courseStudentRepository;
    this.studentRepository = studentRepository;
  }

  async findAll() {
    return this.connection
      .column({
        id: 'establishment.id',
        name: 'establishment.name',
        active: 'establishment.active',
        level: 'grade.level',
        character: 'letter.character',
        studentName: 'student.name',
        studentRut: 'student.rut'
      })
      .from('establishment')
      .leftJoin('course', 'course.establishment_id', 'establishment.id')
      .leftJoin('grade', 'course.grade_id', 'grade.id')
      .leftJoin('letter', 'course.letter_id', 'letter.id')
      .leftJoin('course_student', 'course_student.course_id', 'course.id')
      .leftJoin('student', 'course_student.student_id', 'student.id')
      .where('establishment.active', true);
  }

  async create({ name }) {
    const [result] = await this.connection
      .insert({ name }, ['*'])
      .into('establishment');

    return result;
  }

  async update(number, courses) {
    const grades = new Map();
    const letters = new Map();
    const resultGrades = await this.connection.select().from('grade').orderBy('id');
    const resultLetters = await this.connection.select().from('letter').orderBy('id');
    resultGrades.forEach(g => grades.set(g.level, g.id));
    resultLetters.forEach(l => letters.set(l.character, l.id));

    for (const course of courses) {
      const courseGrade = course.grade;

      for (const letter of course.letters) {

        console.log('repositories', this.courseRepository);

        const courseId = await this.courseRepository.findOrCreate(
          number,
          grades.get(courseGrade),
          letters.get(letter.character)
        );

        await this.courseStudentRepository.deleteByCourseId(courseId);

        for (const student of letter.students) {
          const studentId = await this.studentRepository.findOrCreate(student);
          await this.saveStudentInCourse(studentId, courseId);
        }
      }
    }
  }

  async findOrStoreCourse(establishmentId, gradeId, letterId) {
    let result = await this.connection
      .select()
      .from('course')
      .where('establishment_id', establishmentId)
      .where('grade_id', gradeId)
      .where('letter_id', letterId)
      .first();

    if (result) {
      return result;
    }

    [result] = await this.connection
      .insert({
        establishment_id: establishmentId,
        grade_id: gradeId,
        letter_id: letterId
      }, ['*'])
      .into('course');

    return result;
  }

  async findOrStoreStudent(student) {
    let result = await this.connection
      .select()
      .from('student')
      .where('rut', student.run)
      .first();

    if (result) {
      return result;
    }

    [result] = await this.connection
      .insert({
        name: student.name,
        rut: student.run
      }, ['*'])
      .into('student');

    return result.id;
  }

  saveStudentInCourse(studentId, courseId) {
    return this.connection
      .insert({
        course_id: courseId,
        student_id: studentId
      })
      .into('course_student');
  }
}

module.exports = EstablishmentRepository;
