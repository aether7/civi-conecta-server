const Grades = require('../models/grades');
const { EntityNotFoundError } = require('./exceptions');

class GradeRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findAll() {
    return this.connection
      .select()
      .from('grade')
      .orderBy('id');
  }

  findLetters() {
    return this.connection
      .select()
      .from('letter')
      .orderBy('id');
  }

  async findOneByGrade(grade) {
    const entity = await this.connection
      .select()
      .from('grade')
      .where('level', grade)
      .first();

    if (!entity) {
      throw new EntityNotFoundError(`No se encontro el nivel ${grade}`);
    }

    return entity;
  }
}

module.exports = GradeRepository;
