const repositories = require('../../repositories');
const exceptions = require('../../repositories/exceptions');
const messages = require('../../config/messages');
const { tryCatch } = require('../../helpers/controller');
const dto = require('./dto');

const getUnitsByGrade = async (req, res) => {
  const gradeToSearch = req.query.grade;
  const grade = await repositories.grade.findOneByGrade(gradeToSearch);
  const units = await repositories.unit.findByGradeId(grade.id);

  res.json({ ok: true, units });
};

const createUnit = async (req, res) => {
  const {
    number,
    title,
    description,
    grade: gradeToFind,
    topic: topicToFind,
  } = req.body;

  const grade = await repositories.grade.findOneByGrade(gradeToFind);
  const topic = await repositories.topic.findOneByNumber(topicToFind);
  const previousUnit = await repositories.unit.findOneByNumberAndGradeId(number, grade.id);

  if (previousUnit) {
    throw new exceptions.EntityAlreadyExistsError(messages.unit.alreadyExists);
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
};

const updateUnit = async (req, res) => {
  const gradeToSearch = req.query.grade;
  const numberToSearch = req.query.number;

  const grade = await repositories.grade.findOneByGrade(gradeToSearch);
  const topic = await repositories.topic.findOneByNumber(numberToSearch);

  const fieldsToUpdate = {
    title: req.body.title,
    description: req.body.description,
    topicId: topic.id
  };

  const unit = await repositories.unit.update(number, grade.id, fieldsToUpdate);
  res.json({ ok: true, unit });
};

const deleteUnit = async (req, res) => {
  const gradeToSearch = req.query.grade;
    const number = req.query.number;

  const grade = await repositories.grade.findOneByGrade(gradeToSearch);
  const unit = await repositories.unit.findOneByNumberAndGradeId(number, grade.id);
  const associatedClasses = await repositories.class.findByUnitId(unit.id);

  if (associatedClasses.length) {
    throw new exceptions.EntityWithDependenciesError(messages.unit.hasAssociatedClass);
  }

  await repositories.unit.remove(unit.id);
  res.json({ ok: true, message: messages.unit.unitRemoved });
};

module.exports = {
  getUnitsByGrade: tryCatch(getUnitsByGrade),
  createUnit: tryCatch(createUnit),
  updateUnit: tryCatch(updateUnit),
  deleteUnit: tryCatch(deleteUnit)
};
