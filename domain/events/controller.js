const repositories = require('../../repositories');
const { tryCatch } = require('../../helpers/controller');
const dto = require('./dto');


const getEventsByType = async (req, res) => {
  const eventType = req.params.eventType;
  const results = await repositories.event.findByEventTypeId(eventType);
  res.json({ ok: true, events: results.map(dto.mapEvent) });
};

const getEventById = async (req, res) => {
  const eventId = req.params.eventId;
  const event = await repositories.event.findById(eventId);

  res.json({ ok: true, event: dto.mapEvent(event) });
};

const createEvent = async (req, res) => {
  const eventTypeId = req.params.eventType;
  const eventPayload = dto.getEvent(eventTypeId, req.body);
  const newEvent = await repositories.event.create(eventPayload);
  res.json({ ok: true, event: dto.mapEvent(newEvent) });
};

const deleteEvent = async (req, res) => {
  const eventId = req.params.eventId;

  await repositories.planning.deleteByEventId(eventId);
  await repositories.event.deleteById(eventId);

  res.json({ ok: true });
};

module.exports = {
  getEventsByType: tryCatch(getEventsByType),
  createEvent: tryCatch(createEvent),
  deleteEvent: tryCatch(deleteEvent),
  getEventById: tryCatch(getEventById)
};
