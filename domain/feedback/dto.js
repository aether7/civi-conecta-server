const mapFeedback = (data) => {
  return {
    uuid: data.uuid,
    isFinished: Boolean(data.is_finished)
  };
};

const mapSurvey = (data, answers) => {
  const chosenAnswers = answers.map(answer => answer.id);

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
      generated: !!studentStatus,
      completed: studentStatus && studentStatus.pendingStudentCompletion == 0
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
