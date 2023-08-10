const repositories = require('../../repositories');
const { wrapRequests } = require('../../helpers/controller');
const exceptions = require('../../repositories/exceptions');
const messages = require('../../config/messages');
const dto = require('./dto');


const MINIMUM_PERCENTAGE_TO_CLOSE_SURVEY = 51;

const checkFeedbackStatus = async (req, res) => {
  const uuid = req.params.uuid;

  const [teacherStatus, studentStatus] = await Promise.all([
    repositories.feedback.checkStatusByTeacherAlias(uuid),
    repositories.feedback.checkStudentStatusByTeacherAlias(uuid)
  ]);

  res.json({ ok: true, status: dto.mapStatus(teacherStatus, studentStatus) });
};

const getFeedback = async (req, res) => {
  const alias = req.params.aliasId;
  const surveyType = req.params.surveyType;
  const feedback = await repositories.feedback.findByTypeAndAlias(surveyType, alias);

  req.logger.info('alias from user: %s', alias);
  req.logger.info('survey type got: %s', surveyType);

  const course = await (feedback.student_id ?
    repositories.course.findByStudent(feedback.student_id) :
    repositories.course.findByTeacher(feedback.teacher_id)
  );

  const [survey, answers] = await Promise.all([
    repositories.survey.findWithDataByTypeAndCourse(surveyType, course.id),
    repositories.answer.findByAlias(alias)
  ]);

  res.json({
    ok: true,
    feedback: dto.mapFeedback(feedback),
    survey: dto.mapSurvey(survey, answers)
  });
};

const saveAnswer = async (req, res) => {
  const surveyId = req.params.surveyId;
  const surveyType = req.params.type;
  const aliasId = req.params.aliasId;
  const questionId = req.body.questionId;
  const letter = req.body.letter;

  const [feedback, alternative] = await Promise.all([
    repositories.feedback.findBySurveyAliasAndTypeAndAlias(
      surveyId,
      surveyType,
      aliasId
    ),
    repositories.alternative.findByQuestionAndLetter(questionId, letter)
  ]);

  await repositories.answer.save(feedback.id, questionId, alternative.id);

  res.json({ ok: true });
};

const checkDetailedStatus = async (req, res) => {
  const uuid = req.params.uuid;

  const [teacherProgress, studentsProgress] = await Promise.all([
    repositories.feedback.findProgressByTeacher(uuid),
    repositories.feedback.findProgressByStudent(uuid)
  ]);

  const surveyStatistics = dto.mapStatistics(teacherProgress, studentsProgress);
  res.json({ ok: true, surveyStatistics });
};

const finishSurvey = async (req, res) => {
  const surveyType = req.params.surveyType;
  const uuid = req.params.aliasId;
  await repositories.feedback.finishSurvey(surveyType, uuid);
  res.json({ ok: true });
};

const finishAllSurveys = async (req, res) => {
  const uuid = req.params.uuid;
  const results = await repositories.feedback.checkCurrentSurveyCompletion(uuid);
  const completed = Number(results.find(r => r.is_finished === 'yes')?.quantity ?? 0);
  const notCompleted = Number(results.find(r => r.is_finished === 'no')?.quantity ?? 0);
  const total = completed + notCompleted;
  const completionRate = (completed / total) * 100;

  if (completionRate < MINIMUM_PERCENTAGE_TO_CLOSE_SURVEY) {
    const message = messages.survey.canNotCloseSurvey.replace('{}', completionRate.toFixed(2));
    throw new exceptions.SurveyWithInsufficientCompletionError(message);
  }

  const teacher = await repositories.user.findByFeedbackCourseUUID(uuid);

  await repositories.feedback.finishSurveyCompletely(uuid);
  await repositories.user.updateCustomPlanification(teacher.id);

  res.json({ ok: true });
};

const checkSurveyStatus = async (req, res) => {
  const rut = req.params.rut;
  const survey = await repositories.feedback.checkStudentStatusByRut(rut);
  const isSurveyFinished = Number.parseInt(survey.is_finished);
  res.json({ok: true, isSurveyFinished });
};

module.exports = wrapRequests({
  checkFeedbackStatus,
  getFeedback,
  saveAnswer,
  checkDetailedStatus,
  finishSurvey,
  finishAllSurveys,
  checkSurveyStatus
});
