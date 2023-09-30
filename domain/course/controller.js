const repositories = require('../../repositories');
const { wrapRequests } = require('../../helpers/controller');
const { TeacherAlreadyAssignedError } = require('../../repositories/exceptions');
const messages = require('../../config/messages');
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

const assignTeacher = async (req, res) => {
  const courseId = req.params.courseId;

  const user = await repositories.user.findOrCreateUser({
    name: req.body.name,
    email: req.body.email
  });

  const coursesTakenByTeacher = await repositories.course.findByTeacher(user.id);

  if (coursesTakenByTeacher) {
    throw new TeacherAlreadyAssignedError(messages.establishment.teacherAlreadyAssigned);
  }

  const course = await repositories.course.findById(courseId);
  await repositories.course.updateTeacher(user.id, course.id);

  res.json({ ok : true, user: dto.mapTeacher(user) });
};

module.exports = wrapRequests({
  findCourse,
  findStudents,
  addStudent,
  assignTeacher
});
