const repositories = require('../../repositories');
const dto = require('./dto');

const getEventsByGrade = async (req, res) => {
  const gradeToSearch = req.query.grade;

  try {
    const grade = await repositories.grade.findOneByGrade(gradeToSearch);
    const results = await repositories.event.findByGradeId(grade.id, false);
    res.json({ ok: true, events: results.map(dto.mapEvent) });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

const createEphemeris = async (req, res) => {
  const gradeToSearch = req.body.grade;

  const ephemerisPayload = {
    number: req.body.number,
    title: req.body.title,
    description: req.body.description,
    objective: req.body.objective,
    date: req.body.date,
    isException: false,
    gradeId: null,
    planningId: null
  };

  const planningPayload = {
    topic: req.body.planning.topic,
    startActivity: req.body.planning.startActivity,
    mainActivity: req.body.planning.mainActivity,
    endActivity: req.body.planning.endActivity,
    keywords: req.body.planning.keywords ?? [],
    materials: {
      teacher: req.body.planning.materials.teacher,
      student: req.body.planning.materials.student
    }
  };

  try {
    const grade = await repositories.grade.findOneByGrade(gradeToSearch);
    const planning = await repositories.planning.create(planningPayload);
    const event = await repositories.event.create({
      ...ephemerisPayload,
      gradeId: grade.id,
      planningId: planning.id
    });

    res.json({ ok: true, event: dto.mapEvent(event) });
  } catch(err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

module.exports = {
  getEventsByGrade,
  createEphemeris
};
