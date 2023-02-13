const mapGrade = (grade) => {
  return {
    id: grade.id,
    level: grade.level
  };
};

const mapLetter = (letter) => {
  return {
    id: letter.id,
    character: letter.character
  };
};

module.exports = { mapGrade, mapLetter };
