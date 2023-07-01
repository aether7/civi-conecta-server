class EstablishmentRepository {
  constructor(
    connection, {
      courseRepository,
      courseStudentRepository,
      studentRepository,
      userRepository,
      courseUnitRepository
    }) {
    this.connection = connection;
    this.courseRepository = courseRepository;
    this.courseStudentRepository = courseStudentRepository;
    this.studentRepository = studentRepository;
    this.userRepository = userRepository;
    this.courseUnitRepository = courseUnitRepository;
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
        studentRun: 'student.run'
      })
      .from('establishment')
      .leftJoin('course', 'course.establishment_id', 'establishment.id')
      .leftJoin('grade', 'course.grade_id', 'grade.id')
      .leftJoin('letter', 'course.letter_id', 'letter.id')
      .leftJoin('course_student', 'course_student.course_id', 'course.id')
      .leftJoin('student', 'course_student.student_id', 'student.id')
      .where('establishment.active', 1);
  }

  async create({ name }) {
    const [result] = await this.connection
      .insert({ name }, ['*'])
      .into('establishment');

    return result;
  }

  async update(number, courses) {
    const [resultGrades, resultLetters] = await Promise.all([
      this.connection.select().from('grade').orderBy('id'),
      this.connection.select().from('letter').orderBy('id')
    ]);
    const grades = new Map();
    const letters = new Map();

    resultGrades.forEach(g => grades.set(g.level, g.id));
    resultLetters.forEach(l => letters.set(l.character, l.id));

    for (const course of courses) {
      const courseGrade = course.grade;

      for (const letter of course.letters) {
        const course = await this.courseRepository.findOrCreate(
          number,
          grades.get(courseGrade),
          letters.get(letter.character)
        );
        await this.courseUnitRepository.findOrCreateByCourseId(course.id);
        await this.courseStudentRepository.deleteByCourseId(course.id);

        for (const student of letter.students) {
          const _student = await this.studentRepository.findOrCreate(student);

          await this.courseStudentRepository.create({
            courseId: course.id,
            studentId: _student.id
          });
        }
      }
    }
  }

  async getInfoByTeacher(uuid) {
    return this.connection
      .column({
        establishment_name: 'establishment.name',
        grade: 'grade.level',
        letter: 'letter.character',
        grade_id: 'grade.id'
      })
      .from('user')
      .innerJoin('course', 'course.teacher_id', 'user.id')
      .innerJoin('grade', 'course.grade_id', 'grade.id')
      .innerJoin('letter', 'course.letter_id', 'letter.id')
      .innerJoin('establishment', 'course.establishment_id', 'establishment.id')
      .where('user.uuid', uuid)
      .first();
  }

  async updateActiveStatus(id, status) {
    return this.connection('establishment')
      .where('id', id)
      .update('active', status);
  }

  async findTeachersByEstablishment(establishmentId) {
    const innerQuery = "CASE public.user.encrypted_password WHEN 0 THEN public.user.password ELSE '*******' END";

    return this.connection
      .column({
        establishment_name: 'establishment.name',
        teacher_name: 'public.user.name',
        teacher_email: 'public.user.email',
        passwd: this.connection.raw(innerQuery)
      })
      .from('establishment')
      .innerJoin('course', 'course.establishment_id', 'establishment.id')
      .innerJoin('public.user', 'course.teacher_id', 'public.user.id')
      .where('establishment.id', establishmentId)
      .where('public.user.role', 'User')
      .where('public.user.active', 1)
      .orderBy('public.user.name');
  }

  async findTeachersByEstablishmentAndCourse(establishmentId, courseId) {
    const innerQuery = "CASE public.user.encrypted_password WHEN 0 THEN public.user.password ELSE '*******' END";

    return this.connection
      .column({
        establishment_name: 'establishment.name',
        teacher_name: 'public.user.name',
        teacher_email: 'public.user.email',
        passwd: this.connection.raw(innerQuery)
      })
      .from('establishment')
      .innerJoin('course', 'course.establishment_id', 'establishment.id')
      .innerJoin('public.user', 'course.teacher_id', 'public.user.id')
      .where('establishment.id', establishmentId)
      .where('public.user.role', 'User')
      .where('course.id', courseId)
      .where('public.user.active', 1)
      .orderBy('public.user.name')
      .first();
  }
}

module.exports = EstablishmentRepository;
