function addGrade(obj, row) {
  if (!row.level) {
    return obj;
  }

  let course = obj.courses.find(c => c.id === row.courseId);

  if (!course) {
    course = {
      id: row.courseId,
      level: row.level,
      character: row.character,
      students: []
    };

    obj.courses.push(course);
  }

  return addStudent(course, row);
}

function addStudent(obj, row) {
  if (!row.studentName) {
    return obj;
  }

  obj.students.push({ name: row.studentName, run: row.studentRun });
}

const mapEstablishments = (establishments) => {
  const results = {};

  establishments.forEach(establishment => {
    if (!results[establishment.id]) {
      results[establishment.id] = {
        id: establishment.id,
        name: establishment.name,
        active: establishment.active,
        courses: []
      };
    }

    addGrade(results[establishment.id], establishment);
  });

  return Object.keys(results).reduce((arr, key) => {
    return arr.concat(results[key]);
  }, []);
};

const mapTeacher = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    active: user.active
  };
};

const mapProfileInfo = (data) => {
  return {
    establishment: data?.establishment_name,
    grade: data?.grade,
    gradeId: data?.grade_id,
    letter: data?.letter
  };
};

const mapTeacherInfo = (data) => {
  return {
    establishment: data.establishment_name,
    name: data.teacher_name,
    email: data.teacher_email,
    password: data.passwd
  };
};

module.exports = { mapEstablishments, mapTeacher, mapProfileInfo, mapTeacherInfo };
