const mapFeedback = (data) => {
  return {
    uuid: data.uuid,
    isFinished: Boolean(data.is_finished)
  };
};

const mapSurvey = (survey, answers) => {
  const chosenAnswers = answers.map(answer => answer.id);

  const result = survey.reduce((obj, item) => {
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
      value: item.alternative_value,
      alternativeId: item.alternative_id,
      isSelected: chosenAnswers.includes(item.alternative_id)
    });

    return obj;
  }, {});

  return Object.values(result);
};

const mapStatus = (teacherStatus, studentStatus) => {
  if (!teacherStatus) {
    return {
      survey: { completed: false },
      teacher: { generated: false, completed: false },
      student: { generated: false, completed: false }
    };
  }

  const studentGenerated = studentStatus.reduce((acc, x) => acc + x.quantity, 0) > 0;
  const studentCompleted = studentGenerated && studentStatus.find(s => s.completed === 'no').quantity == 0;

  return {
    survey: {
      completed: Boolean(teacherStatus.is_finished),
      createdAt: teacherStatus.created_at
    },
    teacher: {
      generated: true,
      completed: Boolean(teacherStatus.teacher_finished)
    },
    student: {
      generated: studentGenerated,
      completed: studentCompleted
    }
  };
};

const mapStatistics = (teacherProgress, studentsProgress) => {
  const studentsTotal = studentsProgress[0].total * studentsProgress.length;
  const currentProgress = studentsProgress.reduce((num, student) => {
    return num + student.quantity;
  }, 0);

  return {
    teacher: {
      name: teacherProgress.name,
      survey: {
        total: teacherProgress.total,
        completed: teacherProgress.completed_by_teacher,
        percentage: (teacherProgress.completed_by_teacher / teacherProgress.total) * 100
      }
    },
    students: {
      total: studentsTotal,
      completed: currentProgress,
      percentage: (currentProgress / studentsTotal) * 100,
      details: studentsProgress.map(result => {
        return {
          run: result.run,
          name: result.name,
          lastname: result.lastname,
          survey: {
            completed: result.quantity,
            total: result.total,
            percentage: (result.quantity / result.total) * 100
          }
        };
      })
    }
  };
};

module.exports = {
  mapFeedback,
  mapSurvey,
  mapStatus,
  mapStatistics
};
