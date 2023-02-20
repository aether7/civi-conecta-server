const repositories = require('../../repositories');
const messages = require('../../config/messages');
const { tryCatch } = require('../../helpers/controller');
const dto = require('./dto');

const SurveyTypes = {
  STUDENT: 'student',
  TEACHER: 'teacher'
};

const getAll = async (_, res) => {
  const surveys = await repositories.survey.findAll();
  res.json({ ok : true, surveys: dto.mapSurveys(surveys) });
};

const createSurvey = async (req, res) => {
  const topicToSearch = Number.parseInt(req.body.number);
  const surveyType = req.body.type.toLowerCase();
  const description = req.body.question;
  const alternatives = req.body.alternatives;

  if (surveyType !== SurveyTypes.STUDENT && surveyType !== SurveyTypes.TEACHER) {
    return res.status(400).json({ ok: false, error: messages.survey.typeNotFound });
  }

  const topic = await repositories.topic.findOneByNumber(topicToSearch);
  const survey = await repositories.survey.findOrCreate(surveyType, topic.id);
  const question = await repositories.question.create({
    description,
    surveyId: survey.id
  });

  for (const alternative of alternatives) {
    await repositories.alternative.create({
      letter: alternative.letter,
      description: alternative.description,
      value: alternative.value,
      questionId: question.id
    });
  }

  res.json({ ok: true, message: messages.survey.created });
};

const findById = async (req, res) => {
  const surveyId = req.params.surveyId;
  const survey = await repositories.survey.findOne(surveyId);

  res.json({ ok: true, survey: dto.mapSurvey(survey) });
};

module.exports = {
  getAll: tryCatch(getAll),
  createSurvey: tryCatch(createSurvey),
  findById: tryCatch(findById)
};
