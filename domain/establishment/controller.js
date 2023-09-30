const repositories = require('../../repositories');
const messages = require('../../config/messages');
const exceptions = require('../../repositories/exceptions');
const { wrapRequests } = require('../../helpers/controller');
const dto = require('./dto.js');

const getEstablishments = async (_, res) => {
  const establishments = await repositories.establishment.findAll();

  res.json({
    ok: true,
    establishments: establishments.map(dto.mapEstablishment)
  });
};

const createEstablishment = async (req, res) => {
  const { number, name } = req.body;
  const establishment = await repositories.establishment.create({ number, name });
  res.json({ ok: true, establishment });
};


const getCoursesFromEstablishment = async (req, res) => {
  const establishmentId = Number.parseInt(req.params.establishmentId);
  const courses = await repositories.course.findByEstablishmentId(establishmentId);
  res.json({ ok: true, courses: courses.map(dto.mapCourse) });
};





const updateCoursesEstablishment = async (req, res) => {
  const number = req.params.number;
  const courses = req.body.courses;
  const establishment = await repositories.establishment.update(number, courses);

  req.logger.info('updating number %s', number);
  req.logger.info('updating courses %s', courses);

  res.json({ ok: true, establishment });
};

const updateTeacherToCourse = async (req, res) => {
  const user = await repositories.user.findOrCreateUser({
    name: req.body.name,
    email: req.body.email
  });

  const coursesTakenByTeacher = await repositories.course.findByTeacher(user.id);

  if (coursesTakenByTeacher) {
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

const getProfile = async (req, res) => {
  const uuid = req.params.uuid;
  const result = await repositories.establishment.getInfoByTeacher(uuid);
  req.logger.info('Getting profile for teacher with uuid %s', uuid);

  res.json({ ok: true, info: dto.mapProfileInfo(result) });
};

const updateEstablishmentStatus = async (req, res) => {
  const establishmentId = req.params.id;
  const isActive = req.params.status === 'active' ? 1 : 0;
  await repositories.establishment.updateActiveStatus(establishmentId, isActive);
  res.json({ok: true});
};

const getEstablishmentGrades = async (req, res) => {
  const establishmentId = req.params.establishmentId;
  const gradeId = req.params.gradeId;
  const results = await repositories.course.findByEstablishmentAndGrade(establishmentId, gradeId);
  res.json({ ok: true, courses: results });
};

const getTeacherInfo = async (req, res) => {
  const establishmentId = req.params.establishmentId;
  const courseId = req.params.courseId;
  const result = await repositories.establishment.findTeachersByEstablishmentAndCourse(establishmentId, courseId);

  if (!result.length) {
    throw new exceptions.EntityNotFoundError('No hay profesor asociado a este curso aun');
  }

  res.json({ok: true, teacher: dto.mapTeacherInfo(result[0]) });
};

const getTeachersFromEstablishment = async (req, res) => {
  const establishmentId = Number.parseInt(req.params.establishmentId);
  const result = await repositories.establishment.findTeachersByEstablishment(establishmentId);
  res.json({ok:true, teachers: result.map(dto.mapTeacherInfo)});
};

const getGradesFromEstablishment = async (req, res) => {
  console.log('nidsnfasldkfjaslkdjfklasdf');
  const establishmentId = Number.parseInt(req.params.establishmentId);
  res.json({ ok: true, grades: [] });
};


module.exports = wrapRequests({
  getEstablishments,
  createEstablishment,
  getCoursesFromEstablishment,


  updateCoursesEstablishment,
  updateTeacherToCourse,
  getProfile,
  updateEstablishmentStatus,
  getEstablishmentGrades,
  getTeacherInfo,
  getTeachersFromEstablishment,
  getGradesFromEstablishment
});
