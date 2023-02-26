const { EventTypes } = require('../../constants/entities');

const mapEvent = (data) => {
  const toArray = x => x ? x.split(',') : [];

  return {
    id: data.id,
    number: data.number,
    title: data.title,
    description: data.description,
    date: data.date,
    objective: data.objective,
    grade: data.grade,
    eventType: data.eventType,
    planning: {
      topic: data.topic,
      keywords: toArray(data.keywords),
      materials: {
        teacher: toArray(data.teacher_material),
        student: toArray(data.student_material)
      },
      startActivity: data.start_activity,
      mainActivity: data.main_activity,
      endActivity: data.end_activity
    }
  };
};

const getEvent = (body, query) => {
  let eventTypeId = query.eventType ?? EventTypes.CLASS;
  eventTypeId = Number.parseInt(eventTypeId);

  return {
    number: body.number,
    title: body.title,
    description: body.description,
    objective: body.objective,
    unitId: null,
    gradeId: null,
    date: null,
    eventTypeId,
    get isEphemeris() {
      return this.eventTypeId === EventTypes.EPHEMERIS;
    },
    get isClass() {
      return this.eventTypeId === EventTypes.CLASS;
    }
  };
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
