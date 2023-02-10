const repositories = require('../../repositories');
const {
  EntityAlreadyExistsError,
  EntityWithDependenciesError
} = require('../../repositories/exceptions');

const getUnitsByGrade = async (req, res) => {
  try {
    const grade = await repositories.grade.findOneByGrade(req.query.grade);
    const units = await repositories.unit.findSortedUnitsByGradeId(grade._id);
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
    const previousUnit = await repositories.unit.findOneByUnitAndGradeId(number, grade._id);

    if (previousUnit) {
      throw new EntityAlreadyExistsError('La unidad ya existe');
    }

    const body = {
      number,
      title,
      description,
      grade: grade._id,
      topic: topic._id,
    };

    const newUnit = await repositories.unit.create(body);
    res.json({ ok: true, unit: newUnit });
  } catch(err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

const updateUnit = async (req, res) => {
  try {
    const grade = await repositories.grade.findOneByGrade(req.query.grade);
    const topic = await repositories.topic.findOneByNumber(req.query.number);

    const fieldsToUpdate = {
      title: req.body.title,
      description: req.body.description,
      topic: topic._id
    };

    const unit = await repositories.unit.update(number, gradeId, fieldsToUpdate);
    res.json({ ok: true, unit });
  } catch(err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

const deleteUnit = async (req, res) => {
  try {
    const grade = await repositories.grade.findOneByGrade(req.query.grade);
    const unit = await repositories.unit.findOneByUnitAndGradeId(req.query.number, grade._id);
    const hasClass = await repositories.class.findOneByUnitId(unit._id);

    if (hasClass) {
      throw new EntityWithDependenciesError('La unidad ya tiene una clase asociada');
    }

    await repositories.unit.delete(req.query.number, grade._id);
    res.json({ ok: true, message: 'The unit was removed successfully' });
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
