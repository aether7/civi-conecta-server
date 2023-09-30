const repositories = require('../../repositories');
const dto = require('./dto');

const findCourse = async (req, res) => {
  const courseId = Number.parseInt(req.params.courseId);
  const course = await repositories.course.findById(courseId);
  res.json({ ok: true, course: dto.mapCourse(course) });
};

const findStudents = async (req, res) => {
  const courseId = Number.parseInt(req.params.courseId);
  const students = await repositories.student.findByCourse(courseId);
  res.json({ok: true, students: students.map(dto.mapStudent)});
};


module.exports = {
  findCourse,
  findStudents
};
