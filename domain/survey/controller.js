const repositories = require('../../repositories');
const messages = require('../../config/messages');
const { tryCatch } = require('../../helpers/controller');
const dto = require('./dto');


const getAll = async (_, res) => {
  const surveys = await repositories.survey.findAll();
  res.json({ ok : true, surveys: dto.mapSurveys(surveys) });
};

const saveSurvey = async (req, res) => {
  const topicId = req.params.topicId;
  const title = req.body.title;
  const alternatives = req.body.alternatives;

  req.logger.info('saving topic with questions %s', title);

  const topic = await repositories.topic.findById(topicId);

  const question = await repositories.question.create({
    description: title,
    topicId: topic.id
  });

  for (const alternative of alternatives) {
    await repositories.alternative.create({
      letter: alternative.label,
      description: alternative.description,
      value: alternative.value,
      questionId: question.id
    });
  }

  res.json({ ok: true, question: dto.mapQuestion(question) });
};

const findById = async (req, res) => {
  const surveyId = req.params.surveyId;
  const survey = await repositories.survey.findOne(surveyId);
  res.json({ ok: true, survey: dto.mapSurvey(survey) });
};

const findByStudentType = async (req, res) => {
  const surveys = await repositories.survey.findByType('student');
  res.json({ ok: true, surveys: dto.mapSurveys(surveys) });
};

const deleteQuestion = async (req, res) => {
  const questionId = req.params.questionId;
  await repositories.alternative.deleteByQuestionId(questionId);
  await repositories.question.deleteById(questionId);
  res.json({ ok: true });
};

module.exports = {
  getAll: tryCatch(getAll),
  saveSurvey: tryCatch(saveSurvey),
  findById: tryCatch(findById),
  findByStudentType: tryCatch(findByStudentType),
  deleteQuestion: tryCatch(deleteQuestion)
};
