const repositories = require('../../repositories');
const dto = require('./dto.js');

const getEstablishments = async (_, res) => {
  const establishments = await repositories.establishment.findAll();
  res.json({ ok: true, establishments: dto.mapEstablishments(establishments) });
};

const createEstablishment = async (req, res) => {
  const { number, name } = req.body;
  const establishment = await repositories.establishment.create({ number, name });
  console.log('establishment', establishment);
  res.json({ ok: true, establishment });
};

const updateCoursesEstablishment = async (req, res) => {
  const number = req.params.number;
  const courses = req.body.courses;
  const establishment = await repositories.establishment.update(number, courses);
  res.json({ ok: true, establishment });
};

module.exports = {
  getEstablishments,
  createEstablishment,
  updateCoursesEstablishment
};
