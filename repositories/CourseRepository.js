class CourseRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async findOrCreate(establishmentId, gradeId, letterId) {
    const result = await this.findOneByEstablishmentAndGradeAndLetter(
      establishmentId,
      gradeId,
      letterId
    );

    if (result) {
      return result;
    }

    return this.create(establishmentId, gradeId, letterId);
  }

  findOneByEstablishmentAndGradeAndLetter(establishmentId, gradeId, letterId) {
    return this.connection
      .select()
      .from('course')
      .where('establishment_id', establishmentId)
      .where('grade_id', gradeId)
      .where('letter_id', letterId)
      .first();
  }

  findByGradeLetterEstablishment(grade, letter, establishmentId) {
    return this.connection
      .select('course.*')
      .from('course')
      .innerJoin('grade', 'course.grade_id', 'grade.id')
      .innerJoin('letter', 'course.letter_id', 'letter.id')
      .where('course.establishment_id', establishmentId)
      .where('grade.level', grade)
      .where('letter.character', letter)
      .first();
  }

  findByEstablishmentAndGrade(establishmentId, gradeId) {
    return this.connection
      .column({
        id: 'course.id',
        label: 'grade.level',
        letter: 'letter.character'
      })
      .from('course')
      .innerJoin('grade', 'course.grade_id', 'grade.id')
      .innerJoin('letter', 'course.letter_id', 'letter.id')
      .where('course.establishment_id', establishmentId)
      .where('course.grade_id', gradeId);
  }

  async create(establishmentId, gradeId, letterId) {
    const fields = {
      establishment_id: establishmentId,
      grade_id: gradeId,
      letter_id: letterId
    };

    const [result] = await this.connection
      .insert(fields, ['*'])
      .into('course');

    return result;
  }

  updateTeacher(teacherId, courseId) {
    return this.connection('course')
      .where('id', courseId)
      .update('teacher_id', teacherId);
  }

  findByTeacher(teacherId) {
    return this.connection
      .select()
      .from('course')
      .where('teacher_id', teacherId)
      .first();
  }

  findByStudent(studentId) {
    return this.connection
      .select('course.*')
      .from('course')
      .innerJoin('course_student', 'course_student.course_id', 'course.id')
      .where('course_student.student_id', studentId)
      .first();
  }
}

module.exports = CourseRepository;
