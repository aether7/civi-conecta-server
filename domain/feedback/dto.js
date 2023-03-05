const mapFeedback = (data) => {
  return {
    uuid: data.uuid,
    isFinished: Boolean(data.is_finished)
  };
};

const mapSurvey = (data) => {
  const result = data.reduce((obj, item) => {
    if (!obj[item.question_id]) {
      obj[item.question_id] = {
        id: item.question_id,
        description: item.question_description,
        alternatives: []
      };
    }

    obj[item.question_id].alternatives.push({
      letter: item.alternative_letter,
      description: item.alternative_description,
      value: item.alternative_value
    });

    return obj;
  }, {});

  return Object.values(result);
};

const mapStatus = (data) => {
  if (!data) {
    return {
      survey: { completed: false },
      teacher: { generated: false, completed: false },
      student: { generated: false, completed: false }
    };
  }

  return {
    survey: {
      completed: Boolean(data.is_finished),
      createdAt: data.created_at
    },
    teacher: {
      generated: true,
      completed: Boolean(data.teacher_finished)
    },
    student: {
      generated: data.student_surveys_qty > 0,
      completed: false
    }
  };
};

module.exports = {
  mapFeedback,
  mapSurvey,
  mapStatus
};
