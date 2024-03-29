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
    id: data.id,
    filename: data.filename,
    filepath: data.filepath
  };
};

const mapLesson = (data, documents=[]) => {
  const obj = {
    id: data.id,
    number: data.number,
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
    },
  };

  if (data.title) {
    obj.unit = {
      title: data.title,
      number: data.unit_number
    };
  }

  if (data.date) {
    obj.ephemeris = {
      date: data.date
    };
  }

  return obj;
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
    date: data.date
  };
};

module.exports = {
  mapLesson,
  getLesson,
  getPlanning,
  getPlanningToUpdate
};
