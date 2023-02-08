const EstablishmentRepository = require('./EstablishmentRepository');
const UserRepository = require('./UserRepository');
const GradeRepository = require('./GradeRepository');
const UnitRepository = require('./UnitRepository');
const ClassRepository = require('./ClassRepository');

module.exports = {
  establishment: new EstablishmentRepository(),
  user: new UserRepository(),
  grade: new GradeRepository(),
  unit: new UnitRepository(),
  class: new ClassRepository()
};
