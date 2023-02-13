const repositories = require('../../repositories');
const messages = require('../../config/messages');
const dto = require('./dto');

const {
  EntityAlreadyExistsError,
  EntityWithDependenciesError
} = require('../../repositories/exceptions');

const getUnitsByGrade = async (req, res) => {
  try {
    const gradeToSearch = req.query.grade;
    const grade = await repositories.grade.findOneByGrade(gradeToSearch);
    const units = await repositories.unit.findByGradeId(grade.id);

    res.json({ ok: true, units });
  } catch(err) {
    res.status(404).json({ ok: false, error: err.message });
  }
};

const createUnit = async (req, res) => {
  const {
    number,
    title,
    description,
    grade: gradeToFind,
    topic: topicToFind,
  } = req.body;

  try {
    const grade = await repositories.grade.findOneByGrade(gradeToFind);
    const topic = await repositories.topic.findOneByNumber(topicToFind);
    const previousUnit = await repositories.unit.findOneByNumberAndGradeId(number, grade.id);

    if (previousUnit) {
      throw new EntityAlreadyExistsError(messages.unit.alreadyExists);
    }

    const body = {
      number,
      title,
      description,
      gradeId: grade.id,
      topicId: topic.id
    };

    const unit = await repositories.unit.create(body);
    res.json({ ok: true, unit: dto.mapUnit(unit) });
  } catch(err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

const updateUnit = async (req, res) => {
  const gradeToSearch = req.query.grade;
  const numberToSearch = req.query.number;

  try {
    const grade = await repositories.grade.findOneByGrade(gradeToSearch);
    const topic = await repositories.topic.findOneByNumber(numberToSearch);

    const fieldsToUpdate = {
      title: req.body.title,
      description: req.body.description,
      topicId: topic.id
    };

    const unit = await repositories.unit.update(number, grade.id, fieldsToUpdate);
    res.json({ ok: true, unit });
  } catch(err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

const deleteUnit = async (req, res) => {
  const gradeToSearch = req.query.grade;
    const number = req.query.number;

  try {
    const grade = await repositories.grade.findOneByGrade(gradeToSearch);
    const unit = await repositories.unit.findOneByNumberAndGradeId(number, grade.id);
    const associatedClasses = await repositories.class.findByUnitId(unit.id);

    if (associatedClasses.length) {
      throw new EntityWithDependenciesError(messages.unit.hasAssociatedClass);
    }

    await repositories.unit.remove(unit.id);
    res.json({ ok: true, message: messages.unit.unitRemoved });
  } catch(err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

module.exports = {
  getUnitsByGrade,
  createUnit,
  updateUnit,
  deleteUnit
};
