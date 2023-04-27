const { wrapRequests } = require('../../helpers/controller');
const repositories = require('../../repositories');
const dto = require('./dto');

const checkStudentCompletion = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const teacher = await repositories.user.findByAlias(teacherUUID);
  const course = await repositories.course.findByTeacher(teacher.id);
  const students = await repositories.report.getStudentCompletionReport(course.id);

  res.json({ok: true, report: dto.studentCompletionReport(students)});
};

const checkStudentAnswers = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const results = await repositories.report.getStudentAnswers(teacherUUID);

  res.json({ok:true, results: dto.getStudentAnswers(results)});
};

const checkStudentAnswersByQuestion = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const questionId = req.params.questionId;
  const results = await repositories.report.getStudentAnswers(teacherUUID, questionId);

  res.json({ok: true, results: dto.getStudentAnswers(results)});
};

const checkMostCriticalAnswers = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const results = await repositories.report.getMostCriticalStudentAnswers(teacherUUID);
  res.json({ok: true, results: dto.getMostCriticalAnswers(results)});
};

module.exports = wrapRequests({
  checkStudentCompletion,
  checkStudentAnswers,
  checkStudentAnswersByQuestion,
  checkMostCriticalAnswers
});
