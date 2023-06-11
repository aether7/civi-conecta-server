const repositories = require('../../repositories');
const exceptions = require('../../repositories/exceptions');
const messages = require('../../config/messages');
const { wrapRequests } = require('../../helpers/controller');
const dto = require('./dto');

const getUnitsByGrade = async (req, res) => {
  const gradeId = Number.parseInt(req.params.gradeId);
  const units = await repositories.unit.findByGradeId(gradeId);

  res.json({ ok: true, units });
};

const getUnitById = async (req, res) => {
  const unitId = req.params.unitId;
  const [documents, unit] = await Promise.all([
    repositories.document.findByUnitId(unitId),
    repositories.unit.findByIdWithData(unitId)
  ]);
  res.json({ ok: true, unit: dto.mapUnitWithData(unit, documents) });
};

const createUnit = async (req, res) => {
  const number = req.body.number;
  const title = req.body.title;
  const description = req.body.description;
  const gradeId = req.body.grade;
  const previousUnit = await repositories.unit.findOneByNumberAndGradeId(number, gradeId);

  if (previousUnit) {
    throw new exceptions.EntityAlreadyExistsError(messages.unit.alreadyExists);
  }

  const body = {
    number,
    title,
    description,
    topicId
  };

  const unit = await repositories.unit.create(body);
  res.json({ ok: true, unit: dto.mapUnit(unit) });
};

const deleteUnit = async (req, res) => {
  const unitId = req.params.unitId;
  const quantity = await repositories.lesson.countAssociatedLessonsByUnitId(unitId);
  req.logger.info('trying to delete unit %s', unitId);

  if (quantity) {
    const message = messages.unit.canNotDeleteUnit.replace('{}', quantity);
    throw new exceptions.EntityWithDependenciesError(message);
  }

  await repositories.unit.remove(unitId);
  res.json({ ok: true, message: messages.unit.unitRemoved });
};

const getUnitsByTeacherAlias = async (req, res) => {
  const teacherId = req.params.uuid;
  const units = await repositories.unit.findByTeacherAlias(teacherId);
  req.logger.info('getting units from teacher %s', teacherId);

  res.json({ ok: true, units: units.map(dto.mapUnit) });
};

module.exports = wrapRequests({
  getUnitsByGrade,
  getUnitById,
  createUnit,
  deleteUnit,
  getUnitsByTeacherAlias
});
