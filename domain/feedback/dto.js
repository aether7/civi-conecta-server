const mapFeedback = (data) => {
  return {
    id: data.id,
    isFinished: data.is_finished
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

module.exports = {
  mapFeedback,
  mapSurvey
};
