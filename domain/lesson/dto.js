const toArray = x => {
  if (Array.isArray(x)) {
    return x;
  } else if (!x) {
    return [];
  }

  return x.split(/,|-/).map(item => item.trim());
};

const mapDocument = (data) => {
  return {
    uuid: data.alias,
    filename: data.filename
  };
};

const mapLesson = (data, documents=[]) => {
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

const getLesson = (data) => {
  return {
    number: data.number,
    title: data.title,
    description: data.description,
    objective: data.objective,
    unitId: data.unit
  };
};

const getPlanning = (data) => {
  return {
    topic: data.planning.topic,
    startActivity: data.planning.startActivity,
    mainActivity: data.planning.mainActivity,
    endActivity: data.planning.endActivity,
    keywords: data.planning.keywords ?? [],
    materials: {
      teacher: data.planning.materials.teacher,
      student: data.planning.materials.student
    }
  };
};

const getPlanningToUpdate = (data) => {
  return {
    topic: data.topic,
    keywords: data.keywords,
    studentMaterials: data.studentMaterials,
    teacherMaterials: data.teacherMaterials,
    startActivity: data.startActivity,
    mainActivity: data.mainActivity,
    endActivity: data.endActivity,
    objective: data.objective,
    description: data.description
  };
};

module.exports = {
  mapLesson,
  getLesson,
  getPlanning,
  getPlanningToUpdate
};
