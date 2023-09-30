const mapCourse = (data) => {
  return {
    id: data.id,
    level: data.level,
    character: data.character
  }
};

const mapStudent = (data) => {
  return {
    id: data.id,
    name: data.name,
    run: data.run,
    uuid: data.uuid
  };
};

module.exports = {
  mapCourse,
  mapStudent
};
