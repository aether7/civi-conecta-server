const repositories = require('../../repositories');
const messages = require('../../config/messages');
const exceptions = require('../../repositories/exceptions');
const { wrapRequests } = require('../../helpers/controller');
const dto = require('./dto.js');

const getEstablishments = async (_, res) => {
  const establishments = await repositories.establishment.findAll();
  res.json({ ok: true, establishments: dto.mapEstablishments(establishments) });
};

const createEstablishment = async (req, res) => {
  const { number, name } = req.body;
  const establishment = await repositories.establishment.create({ number, name });
  res.json({ ok: true, establishment });
};

const updateCoursesEstablishment = async (req, res) => {
  const number = req.params.number;
  const courses = req.body.courses;
  const establishment = await repositories.establishment.update(number, courses);
  res.json({ ok: true, establishment });
};

const updateTeacherToCourse = async (req, res) => {
  const user = await repositories.user.findOrCreateUser({
    name: req.body.name,
    email: req.body.email
  });

  const coursesTakenByTeacher = await repositories.course.findByTeacher(user.id);

  if (coursesTakenByTeacher.length) {
    throw new exceptions.TeacherAlreadyAssignedError(messages.establishment.teacherAlreadyAssigned);
  }

  const gradeToSearch = req.body.grade;
  const letterToSearch = req.body.letter;
  const establishmentId = req.body.institution;

  const course = await repositories.course
    .findByGradeLetterEstablishment(gradeToSearch, letterToSearch, establishmentId);

  await repositories.course.updateTeacher(user.id, course.id);

  res.json({ ok : true, user: dto.mapTeacher(user) });
};

module.exports = wrapRequests({
  getEstablishments,
  createEstablishment,
  updateCoursesEstablishment,
  updateTeacherToCourse
});
