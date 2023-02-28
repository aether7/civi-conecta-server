const repositories = require('../../repositories');
const { tryCatch } = require('../../helpers/controller');
const dto = require('./dto');

const getLessonsByGrade = async (req, res) => {
  const gradeToSearch = req.query.grade;
  const grade = await repositories.grade.findOneByGrade(gradeToSearch);
  const results = await repositories.lesson.findByGradeId(grade.id);

  res.json({ ok: true, events: results.map(dto.mapLesson) });
};

const getLessonById = async (req, res) => {
  const lessonId = req.params.lessonId;
  const lesson = await repositories.lesson.findById(lessonId);
  res.json({ ok: true, lesson: dto.mapLesson(lesson) });
};

const createLesson = async (req, res) => {
  const lessonPayload = dto.getLesson(req.body, req.query);
  const planningPayload = dto.getPlanning(req.body);
  const newLesson = await repositories.lesson.create(lessonPayload);
  const planning = await repositories.planning.create(planningPayload, newLesson.id);
  const lesson = await repositories.lesson.findById(newLesson.id);

  res.json({ ok: true, lesson: dto.mapLesson(lesson) });
};

const deleteLesson = async (req, res) => {
  res.json({ ok: true });
};

module.exports = {
  getLessonById: tryCatch(getLessonById),
  createLesson,
  deleteLesson
};
