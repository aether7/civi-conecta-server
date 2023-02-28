const mapUnit = (unit) => {
  return {
    id: unit.id,
    number: unit.number,
    description: unit.description,
    title: unit.title
  };
};

const mapUnitWithData = (data) => {
  const toArray = x => x ? x.split(',') : [];

  const lessons = data
    .map((item) => {
      return {
        id: item.lesson_id,
        number: item.lesson_number,
        title: item.lesson_title,
        objective: item.lesson_objective,
        description: item.lesson_description,
        date: item.lesson_date,
        planning: {
          id: item.planning_id,
          topic: item.planning_topic,
          keywords: toArray(item.planning_keywords),
          startActivity: item.planning_start_activity,
          mainActivity: item.planning_main_activity,
          endActivity: item.planning_end_activity,
          teacherMaterial: toArray(item.planning_teacher_material),
          studentMaterial: toArray(item.planning_student_material)
        }
      };
    })
    .filter(c => c.id);

  return {
    id: data[0].id,
    number: data[0].number,
    title: data[0].title,
    description: data[0].description,
    lessons
  };
};

module.exports = {
  mapUnit,
  mapUnitWithData
};
