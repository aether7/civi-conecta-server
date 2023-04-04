const repositories = require('../../repositories');
const { wrapRequests } = require('../../helpers/controller');
const dto = require('./dto');


const getAll = async (_, res) => {
  const surveys = await repositories.survey.findAll();
  res.json({ ok : true, surveys: dto.mapSurveys(surveys) });
};

const saveSurvey = async (req, res) => {
  const topicId = req.params.topicId;
  const survey = dto.getSurvey(req.body);

  req.logger.info('saving topic with questions %s', survey.title);

  const topic = await repositories.topic.findById(topicId);

  const question = await repositories.question.create({
    description: survey.title,
    topicId: topic.id
  });

  for (const alternative of survey.alternatives) {
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

const getReport = async (req, res) => {
  const uuid = req.params.uuid;
  const teacher = await repositories.user.findByAlias(uuid);
  const course = await repositories.course.findByTeacher(teacher.id);
  const results = await repositories.survey.getReportForSomething(course.id);
  res.json({ ok: true, report: dto.mapStudentAnswerReport(results) });
};

module.exports = wrapRequests({
  getAll,
  saveSurvey,
  findById,
  findByStudentType,
  getReport
});
