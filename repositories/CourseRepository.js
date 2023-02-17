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

  async create(establishmentId, gradeId, letterId) {
    const [result] = await this.connection
      .insert({
        establishment_id: establishmentId,
        grade_id: gradeId,
        letter_id: letterId
      }, ['*'])
      .into('course');

    return result;
  }

  updateTeacher(teacherId, courseId) {
    return this.connection('course')
      .where('id', courseId)
      .update('teacher_id', teacherId)
      .debug();
  }
}

module.exports = CourseRepository;
