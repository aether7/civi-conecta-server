const studentCompletionReport = (students) => {
  const results = students.map(student => {
    const answers = Number.parseInt(student.answers);
    const questions = Number.parseInt(student.question_count);

    return {
      run: student.run,
      name: student.name,
      questions,
      answers,
      percentage: Number(((answers / questions) * 100).toFixed(2))
    };
  });

  return results;
};

const getStudentAnswers = (data) => {
  const groupedResults = data.reduce((obj, row) => {
    if (!obj[row.topic_name]) {
      obj[row.topic_name] = {
        questions: {}
      };
    }

    const topic = obj[row.topic_name];

    if (!topic.questions[row.question_description]) {
      topic.questions[row.question_description] = {
        total: 0,
        alternatives: {}
      };
    }

    const group = topic.questions[row.question_description];
    const quantity = Number.parseInt(row.quantity);
    group.alternatives[row.answer_description] = quantity;
    group.total += quantity;

    return obj;
  }, {});

  const toArray = (groups) => {
    return Object.entries(groups).map(topicEntry => {
      const [title, topicResult] = topicEntry;

      return {
        topic: title,
        questions: Object.entries(topicResult.questions).map(questionEntry => {
          const [question, results] = questionEntry;
          const total = Number.parseInt(results.total);

          return {
            question,
            answers: Object.entries(results.alternatives).map(answerEntry => {
              const label = answerEntry[0];
              const quantity = Number.parseInt(answerEntry[1]);
              return {
                label,
                quantity,
                percentage: Number(((quantity / total) * 100).toFixed(2))
              };
            })
          };
        })
      };
    });
  };

  return toArray(groupedResults);
};

module.exports = {
  studentCompletionReport,
  getStudentAnswers
};
