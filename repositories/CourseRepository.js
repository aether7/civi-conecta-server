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
}

module.exports = CourseRepository;
