const repositories = require('../../repositories');
const { wrapRequests } = require('../../helpers/controller');
const dto = require('./dto');

const checkFeedbackStatus = async (req, res) => {
  const uuid = req.params.uuid;
  const status = await repositories.feedback.checkStatusByTeacherAlias(uuid);

  res.json({ ok: true, status: dto.mapStatus(status) });
};

const createFeedback = async (req, res) => {
  const surveyType = req.params.surveyType;
  const uuid = req.params.uuid;

  await repositories.feedback.createByType(surveyType, uuid);

  res.json({ ok: true });
};

const getFeedback = async (req, res) => {
  const alias = req.params.aliasId;
  const surveyType = req.params.surveyType;
  const feedback = await repositories.feedback.findByTypeAndAlias(surveyType, alias);

  const [survey, answers] = await Promise.all([
    repositories.survey.findWithDataByType(surveyType),
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
  await repositories.feedback.finishSurveyCompletely(uuid);
  res.json({ ok: true });
};

module.exports = wrapRequests({
  checkFeedbackStatus,
  createFeedback,
  getFeedback,
  saveAnswer,
  checkDetailedStatus,
  finishSurvey,
  finishAllSurveys
});
