const { wrapRequests } = require("../../helpers/controller");
const ReportService = require("./service");
const repositories = require("../../repositories");
const dto = require("./dto");

const checkStudentCompletion = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const reportService = new ReportService();
  const report =
    await reportService.checkStudentCompletionByTeacherUUID(teacherUUID);
  res.json({ ok: true, report });
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

const getSurveysReports = async (req, res) => {
  const uuid = req.params.managerUUID;
  const gradeId = req.params.gradeId;
  const establishment = await repositories.establishment.findByManager(uuid);
  const surveyResults = await repositories.report.getSurveyResults(
    establishment.establishment_id,
    gradeId,
  );

  res.json({ ok: true, results: surveyResults.map(dto.mapSurvey) });
};

const checkCourseCompletion = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const courseResume =
    await repositories.course.findCourseGradeByTeacher(teacherUUID);
  const reportService = new ReportService();
  const report =
    await reportService.checkStudentCompletionByTeacherUUID(teacherUUID);
  res.json({ ok: true, report, courseResume });
};

const checkUnitsCompletion = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const results =
    await repositories.unit.findUnitCompletionByTeacherCourse(teacherUUID);
  res.json({ ok: true, results: dto.mapUnitCompletion(results) });
};

const checkLessonsCompletion = async (req, res) => {
  const teacherUUID = req.params.teacherUUID;
  const unitId = req.params.unitId;
  const results = await repositories.lesson.findLessonCompletionByTeacherCourse(
    teacherUUID,
    unitId,
  );
  res.json({ ok: true, results: dto.mapLessonCompletion(results) });
};

const checkEventsCompletion = async (req, res) => {
  const managerUUID = req.headers.uuid;
  const eventType = req.params.eventType;
  const gradeId = req.params.gradeId;

  let results;

  if (eventType === "situation") {
    results = await repositories.report.getReportsSituation(managerUUID, gradeId);
  } else if (eventType === "ephemeris") {
    results = await repositories.report.getReportsEphemeris(managerUUID, gradeId);
  }

  res.json({ ok: true, eventType, results: dto.mapEvents(results, eventType) });
}

const getPlanningUnitsReports = async (req, res) => {
  const managerUUID = req.user.uuid;
  const gradeId = req.params.gradeId;
  const reportService = new ReportService();
  const report = await reportService.findPlanningAndUnitsReport(managerUUID, gradeId);
  res.json({ ok: true, report });
};

module.exports = wrapRequests({
  checkStudentCompletion,
  checkStudentAnswers,
  checkStudentAnswersByQuestion,
  checkMostCriticalAnswers,
  getUnitsOrder,
  getIsCustomPlanification,
  getSurveysReports,
  checkCourseCompletion,
  checkUnitsCompletion,
  checkLessonsCompletion,
  checkEventsCompletion,
  getPlanningUnitsReports
});
