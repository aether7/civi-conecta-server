const mapTopic = (topic) => {
  return {
    id: topic.id,
    title: topic.title,
    alternatives: 4,
    questions: []
  };
};

const mapTopicWithData = (topic) => {
  const result = topic.reduce((obj, item) => {
    if (!obj[item.question_id]) {
      obj[item.question_id] = {
        id: item.question_id,
        description: item.question_description,
        alternatives: []
      };
    }

    obj[item.question_id].alternatives.push({
      label: item.alternative_letter,
      description: item.alternative_description,
      value: item.alternative_value
    });

    return obj;
  }, {});

  const toArray = (dict) => {
    const arr = [];

    Object.entries(dict).forEach(entry => {
      const question = {
        id: entry[0],
        description: entry[1].description,
        alternatives: entry[1].alternatives
      };

      arr.push(question);
    });

    return arr;
  };

  return {
    id: topic[0].topic_id,
    surveyId: topic[0].survey_id,
    title: topic[0].topic_title,
    questions: toArray(result),
    alternatives: 4
  };
};

module.exports = { mapTopic, mapTopicWithData };
