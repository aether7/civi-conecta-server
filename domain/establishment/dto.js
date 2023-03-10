function addGrade(obj, row) {
  if (!row.level) {
    return obj;
  }

  let course = obj.courses.find(c => c.level === row.level);

  if (!course) {
    course = { level: row.level, letters: [] };
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
    establishment: data.establishment_name,
    grade: data.grade
  };
};

module.exports = { mapEstablishments, mapTeacher, mapProfileInfo };
