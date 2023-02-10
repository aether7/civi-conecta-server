const Grades = require('../models/grades');
const { EntityNotFoundError } = require('./exceptions');

class GradeRepository {
  async findOneByGrade(grade) {
    const entity = await Grades.findOne({ level: grade });

    if (!entity) {
      throw new EntityNotFoundError(`No se encontro el nivel ${grade}`);
    }

    return entity;
  }
}

module.exports = GradeRepository;
