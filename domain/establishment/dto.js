const mapEstablishment = (establishment) => {
  return {
    id: establishment.id,
    name: establishment.name,
    active: establishment.active
  };
};

const mapCourse = (course) => {
  return {
    id: course.id,
    level: course.level,
    character: course.character,
    gradeId: course.grade_id,
    letterId: course.letter_id
  };
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

module.exports = {
  mapEstablishment,
  mapTeacher,
  mapProfileInfo,
  mapTeacherInfo,
  mapCourse
};
