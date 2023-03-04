const repositories = require('../../repositories');
const { tryCatch } = require('../../helpers/controller');
const dto = require('./dto');

const getLessonById = async (req, res) => {
  const lessonId = req.params.lessonId;
  const [lesson, documents] = await Promise.all([
    repositories.lesson.findById(lessonId),
    repositories.document.findByLesson(lessonId)
  ]);

  res.json({ ok: true, lesson: dto.mapLesson(lesson, documents) });
};

const createLesson = async (req, res) => {
  const lessonPayload = dto.getLesson(req.body, req.query);
  const planningPayload = dto.getPlanning(req.body);
  const newLesson = await repositories.lesson.create(lessonPayload);
  await repositories.planning.create(planningPayload, newLesson.id);
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
