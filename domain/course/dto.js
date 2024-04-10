const mapCourse = (data) => {
  return {
    id: data.id,
    level: data.level,
    character: data.character
  };
};

const mapStudent = (data) => {
  return {
    id: data.id,
    name: data.name,
    run: data.run,
    uuid: data.uuid
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

module.exports = {
  mapCourse,
  mapStudent,
  mapTeacher
};
