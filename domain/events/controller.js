const repositories = require('../../repositories');
const dateHelper = require('../../helpers/date');
const { tryCatch } = require('../../helpers/controller');
const dto = require('./dto');

const EventTypes = {
  CLASS: 1,
  SITUATION: 2,
  EPHEMERIS: 3
};

const getEventsByGrade = async (req, res) => {
  let eventType = req.query.eventType ?? EventTypes.CLASS;
  let results;

  eventType = Number.parseInt(eventType);

  if (eventType === EventTypes.CLASS) {
    const gradeToSearch = req.query.grade;
    const grade = await repositories.grade.findOneByGrade(gradeToSearch);
    results = await repositories.event.findByGradeId(grade.id, eventType);
  } else {
    results = await repositories.event.findByEventTypeId(eventType);
  }

  res.json({ ok: true, events: results.map(dto.mapEvent) });
};

const createEvent = async (req, res) => {
  let date;
  let gradeId = null;
  let eventTypeId = req.query.eventType ?? EventTypes.CLASS;

  eventTypeId = Number.parseInt(eventTypeId);

  if (eventTypeId === EventTypes.EPHEMERIS) {
    date = dateHelper.dateToMonthDay(req.body.date);
  }

  const eventPayload = {
    number: req.body.number,
    title: req.body.title,
    description: req.body.description,
    objective: req.body.objective,
    planningId: null,
    gradeId,
    eventTypeId,
    date
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

  if (eventTypeId === EventTypes.CLASS) {
    const gradeToSearch = req.body.grade;
    const grade = await repositories.grade.findOneByGrade(gradeToSearch);
    gradeId = grade.id;
  }

  const planning = await repositories.planning.create(planningPayload);
  const newEvent = await repositories.event.create({
    ...eventPayload,
    planningId: planning.id,
    gradeId
  });
  const event = await repositories.event.findById(newEvent.id);
  res.json({ ok: true, event: dto.mapEvent(event) });
};

module.exports = {
  getEventsByGrade: tryCatch(getEventsByGrade),
  createEvent: tryCatch(createEvent)
};
