const repositories = require('../../repositories');
const { wrapRequests } = require('../../helpers/controller');
const dto = require('./dto');

const getEventsByType = async (req, res) => {
  const eventType = req.params.eventType;
  const gradeId = req.query.grade;
  const results = await repositories.event.findByEventTypeId(eventType, gradeId);
  res.json({ ok: true, events: results.map(dto.mapEvent) });
};

const getEventById = async (req, res) => {
  const eventId = req.params.eventId;
  const event = await repositories.event.findById(eventId);

  res.json({ ok: true, event: dto.mapEventWithPlanning(event) });
};

const createEvent = async (req, res) => {
  const eventTypeId = req.params.eventType;
  const eventPayload = dto.getEvent(eventTypeId, req.body);
  const planningPayload = dto.getPlanning(req.body);
  const newEvent = await repositories.event.create(eventPayload);
  const lesson = await repositories.lesson.create({
    description: newEvent.description,
    eventId: newEvent.id
  });
  await repositories.planning.create(planningPayload, lesson.id);
  const eventWithPlanning = await repositories.event.findById(newEvent.id);
  res.json({ ok: true, event: dto.mapEventWithPlanning(eventWithPlanning) });
};

const deleteEvent = async (req, res) => {
  const eventId = req.params.eventId;

  await repositories.planning.deleteByEventId(eventId);
  await repositories.event.deleteById(eventId);

  res.json({ ok: true });
};

module.exports = wrapRequests({
  getEventsByType,
  createEvent,
  deleteEvent,
  getEventById
});
