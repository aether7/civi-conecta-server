const { wrapRequests } = require("../../helpers/controller");
const repositories = require("../../repositories");
const dto = require("./dto");

const checkStudentCompletion = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const teacher = await repositories.user.findByAlias(teacherUUID);
  const course = await repositories.course.findByTeacher(teacher.id);
  const students = await repositories.report.getStudentCompletionReport(
    course.id,
  );

  res.json({ ok: true, report: dto.studentCompletionReport(students) });
};

const checkStudentAnswers = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const results = await repositories.report.getStudentAnswers(teacherUUID);

  res.json({ ok: true, results: dto.getStudentAnswers(results) });
};

const checkStudentAnswersByQuestion = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const questionId = req.params.questionId;
  const results = await repositories.report.getStudentAnswers(
    teacherUUID,
    questionId,
  );

  res.json({ ok: true, results: dto.getStudentAnswers(results) });
};

const checkMostCriticalAnswers = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const results =
    await repositories.report.getMostCriticalStudentAnswers(teacherUUID);
  res.json({ ok: true, results: dto.getMostCriticalAnswers(results) });
};

const getUnitsOrder = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const teacher = await repositories.user.findByAlias(teacherUUID);
  const course = await repositories.course.findByTeacher(teacher.id);
  const results = await repositories.report.getUnitOrder(course.id);
  res.json({ ok: true, results: dto.getUnitsOrder(results) });
};

const getIsCustomPlanification = async (req, res) => {
  const establishmentId = req.params.establishmentId;
  const results =
    await repositories.report.getIsCustomPlanification(establishmentId);
  res.json({ ok: true, results: dto.getPlanificationsType(results) });
};

const getUnitPlanningReport = async (req, res) => {
  const uuid = req.params.managerUUID;
  const gradeId = req.params.gradeId;
  const establishment = await repositories.establishment.findByManager(uuid);
  const surveyResults = await repositories.report.getSurveyResults(
    establishment.establishment_id,
    gradeId,
  );

  res.json({ ok: true, results: surveyResults.map(dto.mapSurvey) });
};

module.exports = wrapRequests({
  checkStudentCompletion,
  checkStudentAnswers,
  checkStudentAnswersByQuestion,
  checkMostCriticalAnswers,
  getUnitsOrder,
  getIsCustomPlanification,
  getUnitPlanningReport,
});
