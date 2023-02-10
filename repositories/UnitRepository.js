const Units = require('../models/units');
const { EntityNotFoundError } = require('./exceptions');

class UnitRepository {
  async findOneByUnitAndGradeId(unit, gradeId) {
    const entity = await Units.findOne({ number: unit, grade: gradeId });

    if (!entity) {
      throw new EntityNotFoundError(`No existe la unidad ${unit} del nivel ${gradeId} `);
    }

    return entity;
  }

  findSortedUnitsByGradeId(gradeId) {
    return Units.find({ grade: gradeId })
      .sort({ number: 1 })
      .populate({ path: 'grade', select: '-_id -__v' })
      .populate({ path: 'topic', select: '-_id -__v' });
  }

  async create(payload) {
    const unit = await Units.create(payload);
    const popGra = { path: "grade", select: "-_id -__v" };
    const popTop = { path: "topic", select: "-_id -__v" };
    const newUnit = await unit.populate([popGra, popTop]);

    return newUnit;
  }

  update(number, gradeId, fieldsToUpdate) {
    const query = { number, grade: gradeId };
    const options = { new: true, runValidators: true, context: 'query' };
    return Units.findOneAndUpdate(query, fieldsToUpdate, options);
  }

  delete(number, gradeId) {
    const query = { number, grade: gradeId };
    return Units.findOneAndDelete(query);
  }
}

module.exports = UnitRepository;
