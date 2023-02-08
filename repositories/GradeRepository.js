const Grades = require('../models/grades');

class GradeRepository {
  findOneByGrade(grade) {
    return Grades.findOne({ level: grade }).exec();
  }
}

module.exports = GradeRepository;
