const toArray = (result) => {
  const arr = [];

  Object.entries(result).forEach(entry => {
    const survey = entry[1];
    const questions = [];

    Object.entries(survey.questions).forEach(e => {
      const question = e[1];
      questions.push(question);
    });

    arr.push({ ...survey, questions });
  });

  return arr;
};

const mapSurveys = (surveys) => {
  const result = surveys.reduce((dict, item) => {
    if (!dict[item.id]) {
      dict[item.id] = {
        id: item.id,
        questions: {}
      };
    }

    if (!dict[item.id].questions[item.questionId]) {
      dict[item.id].questions[item.questionId] = {
        id: item.questionId,
        question: item.question,
        alternatives: []
      };
    }

    dict[item.id].questions[item.questionId].alternatives.push({
      letter: item.letter,
      alternative: item.alternative,
      value: item.value
    });

    return dict;
  }, {});

  return toArray(result);
};

const mapSurvey = (data) => {
  return mapSurveys([data])[0];
};

const mapQuestion = (data) => {
  return {
    id: data.id,
    description: data.description
  };
};

const getSurvey = (data) => {
  const title = data.title;
  const alternatives = data.alternatives
    .filter(a => a.description.trim() !== '');

  return {
    title,
    alternatives
  };
};

const mapStudentAnswerReport = (data) => {
  return data.reduce((obj, item) => {
    if (!obj[item.topic_name]) {
      obj[item.topic_name] = {};
    }

    if (!obj[item.topic_name][item.question_made]) {
      obj[item.topic_name][item.question_made] = [];
    }

    obj[item.topic_name][item.question_made].push({
      description: item.alternative_description,
      percent: Number.parseFloat(((item.qty_answers / item.total) * 100).toFixed(2))
    });

    return obj;
  }, {});
};

module.exports = {
  mapSurveys,
  mapSurvey,
  mapQuestion,
  getSurvey,
  mapStudentAnswerReport
};
