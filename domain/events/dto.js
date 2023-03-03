const { EventTypes } = require('../../constants/entities');
const dateHelper = require('../../helpers/date');

const mapEvent = (data) => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date
  };
};

const getEvent = (eventTypeId, data) => {
  const event = {
    title: data.title,
    description: data.description,
    eventTypeId,
    date: data.date,
    get isEphemeris() {
      return this.eventTypeId === EventTypes.EPHEMERIS;
    }
  };

  if (event.isEphemeris) {
    event.date = dateHelper.dateToMonthDay(date.date);
  }

  return event;
};

const getPlanning = (body) => {
  return {
    topic: body.planning.topic,
    startActivity: body.planning.startActivity,
    mainActivity: body.planning.mainActivity,
    endActivity: body.planning.endActivity,
    keywords: body.planning.keywords ?? [],
    materials: {
      teacher: body.planning.materials.teacher,
      student: body.planning.materials.student
    }
  };
};

module.exports = {
  mapEvent,
  getEvent,
  getPlanning
};
