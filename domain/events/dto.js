const mapEvent = (data) => {
  return {
    id: data.id,
    number: data.number,
    title: data.title,
    description: data.description,
    date: data.date,
    objective: data.objective,
    grade: data.grade,
    planning: {
      topic: data.topic,
      keywords: data.keywords ? data.keywords.split(',') : [],
      materials: {
        teacher: data.teacher_material.split(','),
        student: data.student_material.split(',')
      },
      startActivity: data.start_activity,
      mainActivity: data.main_activity,
      endActivity: data.end_activity
    }
  };
};

module.exports = {
  mapEvent
};
