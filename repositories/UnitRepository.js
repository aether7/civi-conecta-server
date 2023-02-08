const Units = require('../models/units');

class UnitRepository {
  findOneByUnitAndGradeId(unit, gradeId) {
    return Units.findOne({ number: unit, grade: gradeId }).exec();
  }
}

module.exports = UnitRepository;
