const mapDocument = (data) => {
  return {
    uuid: data.alias,
    filename: data.filename
  };
};

const mapLesson = (data, documents) => {
  const toArray = x => x ? x.split(',') : [];

  return {
    id: data.id,
    number: data.number,
    description: data.description,
    objective: data.objective,
    files: documents.map(mapDocument),
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

const getLesson = (body, query) => {
  return {
    number: body.number,
    title: body.title,
    description: body.description,
    objective: body.objective,
    unitId: body.unit
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
  mapLesson,
  getLesson,
  getPlanning
};
