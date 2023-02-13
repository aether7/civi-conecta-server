const repositories = require('../../repositories');
const dto = require('./dto');

const getGrades = async (_, res) => {
  const grades = await repositories.grade.findAll();
  res.json({ ok: true, grades: grades.map(dto.mapGrade) });
};

const getLetters = async (req, res) => {
  const letters = await repositories.grade.findLetters();
  res.json({ ok: true, letters: letters.map(dto.mapLetter) });
};

module.exports = { getGrades, getLetters };
