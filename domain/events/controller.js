const repositories = require('../../repositories');
const dateHelper = require('../../helpers/date');
const { tryCatch } = require('../../helpers/controller');
const { EventTypes } = require('../../constants/entities');
const dto = require('./dto');


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

const getEventById = async (req, res) => {
  const eventId = req.params.eventId;
  const event = await repositories.event.findById(eventId);

  res.json({ ok: true, event: dto.mapEvent(event) });
};

const createEvent = async (req, res) => {
  const eventPayload = dto.getEvent(req.body, req.query);
  const planningPayload = dto.getPlanning(req.body);

  if (eventPayload.isEphemeris) {
    eventPayload.date = dateHelper.dateToMonthDay(req.body.date)
  }

  if (eventPayload.isClass) {
    const unitToSeach = req.body.unit;
    eventPayload.unitId = req.body.unit;
  }

  const newEvent = await repositories.event.create(eventPayload);
  const planning = await repositories.planning.create(planningPayload, newEvent.id);
  const event = await repositories.event.findById(newEvent.id);
  res.json({ ok: true, event: dto.mapEvent(event) });
};

const deleteEvent = async (req, res) => {
  const eventId = req.params.eventId;

  await repositories.planning.deleteByEventId(eventId);
  await repositories.event.deleteById(eventId);

  res.json({ ok: true });
};

module.exports = {
  getEventsByGrade: tryCatch(getEventsByGrade),
  createEvent: tryCatch(createEvent),
  deleteEvent: tryCatch(deleteEvent),
  getEventById: tryCatch(getEventById)
};
