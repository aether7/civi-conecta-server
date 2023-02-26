const repositories = require('../../repositories');
const exceptions = require('../../repositories/exceptions');
const messages = require('../../config/messages');
const { tryCatch } = require('../../helpers/controller');
const dto = require('./dto');

const getUnitsByGrade = async (req, res) => {
  const gradeToSearch = req.query.gradeId;
  const units = await repositories.unit.findByGradeId(gradeToSearch);

  res.json({ ok: true, units });
};

const getUnitById = async (req, res) => {
  const unitId = req.params.unitId;
  const unit = await repositories.unit.findByIdWithData(unitId);

  res.json({ ok: true, unit: dto.mapUnitWithData(unit) });
};

const createUnit = async (req, res) => {
  const number = req.body.number;
  const title = req.body.title;
  const description = req.body.description;
  const gradeId = req.body.grade;
  const topicId = req.body.topicId;

  const previousUnit = await repositories.unit.findOneByNumberAndGradeId(number, gradeId);

  if (previousUnit) {
    throw new exceptions.EntityAlreadyExistsError(messages.unit.alreadyExists);
  }

  const body = {
    number,
    title,
    description,
    gradeId,
    topicId
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
  const unitId = req.params.unitId;
  const associatedClasses = await repositories.event.findClassesByUnitId(unitId);

  if (associatedClasses.length) {
    throw new exceptions.EntityWithDependenciesError(messages.unit.hasAssociatedClass);
  }

  await repositories.unit.remove(unitId);
  res.json({ ok: true, message: messages.unit.unitRemoved });
};

module.exports = {
  getUnitsByGrade: tryCatch(getUnitsByGrade),
  getUnitById: tryCatch(getUnitById),
  createUnit: tryCatch(createUnit),
  updateUnit: tryCatch(updateUnit),
  deleteUnit: tryCatch(deleteUnit)
};
