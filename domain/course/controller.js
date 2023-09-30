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

const addStudent = async (req, res) => {
  const courseId = Number.parseInt(req.params.courseId);
  const { name, run } = req.body;
  const newStudent = await repositories.student.create({ name, run });

  await repositories.courseStudent.create({ courseId, studentId: newStudent.id });

  res.json({ ok: true, student: dto.mapStudent(newStudent) });
};


module.exports = {
  findCourse,
  findStudents,
  addStudent
};
