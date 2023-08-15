function addGrade(obj, row) {
  if (!row.level) {
    return obj;
  }

  let course = obj.courses.find(c => c.level === row.level);

  if (!course) {
    course = { id: row.courseId, level: row.level, letters: [] };
    obj.courses.push(course);
  }

  return addLetter(course, row);
}

function addLetter(obj, row) {
  if (!row.character) {
    return obj;
  }

  let letter = obj.letters.find(l => l.character === row.character);

  if (!letter) {
    letter = { character: row.character, students: [] };
    obj.letters.push(letter);
  }

  return addStudent(letter, row);
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
    password: data.passwd,
    course: `${data.grade} ${data.letter}`
  };
};

module.exports = { mapEstablishments, mapTeacher, mapProfileInfo, mapTeacherInfo };
