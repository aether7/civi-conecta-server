const repositories = require('../../repositories');
const { wrapRequests } = require('../../helpers/controller');
const exceptions = require('../../repositories/exceptions');
const messages = require('../../config/messages');
const dto = require('./dto');

const getTopics = async (req, res) => {
  const gradeId = Number.parseInt(req.params.gradeId);
  const topics = await repositories.topic.findByGradeId(gradeId);
  res.json({ ok: true, topics: topics.map(dto.mapUnit) });
};

const getTopicById = async (req, res) => {
  const unitId = req.params.unitId;
  const isForStudent = req.params.questionType === 'teacher' ? 0 : 1;
  const result = await repositories.topic.findByIdWithData(unitId, isForStudent);

  if (!result.length) {
    const topic = await repositories.topic.findById(unitId);
    return res.json({ ok: true, topic: dto.mapUnit(topic) });
  }

  res.json({ ok: true, topic: dto.mapTopicWithData(result) });
};

const createUnit = async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const gradeId = Number.parseInt(req.body.gradeId);
  const objective = req.body.objective;
  let number = Number.parseInt(req.body.number);

  if (Number.isNaN(number)) {
    number = 1;
  }

  const grade = await repositories.grade.findById(gradeId);
  const previousUnits = await repositories.unit.findByGradeId(gradeId);

  if (previousUnits.length >= Number.parseInt(grade.units_quantity)) {
    throw new exceptions.GradeExceedingUnitsError(messages.topic.gradeExceedingQuota);
  }

  const unit = await repositories.unit.create({ title, number, description, gradeId, objective });
  res.json({ ok: true, topic: dto.mapUnit(unit) });
};

const deleteTopic = async (req, res) => {
  const topicId = req.params.topicId;
  const quantity = await repositories.topic.countAssociatedQuestionsByTopicId(topicId);
  req.logger.info('trying to delete unit %s', topicId);

  if (quantity) {
    const message = messages.topic.canNotDeleteTopic.replace('{}', quantity);
    throw new exceptions.TopicWithAssociatedQuestionsError(message);
  }

  await repositories.topic.deleteById(topicId);
  res.json({ ok: true });
};

const updateTopic = async (req, res) => {
  const topicId = req.params.topicId;
  const title = req.body.title;
  const alternatives = req.body.alternatives;
  const isForStudent = req.body.surveyType === 'teacher' ? 0 : 1;
  const topic = await repositories.topic.findById(topicId);

  req.logger.info('saving topic with questions %s', title);

  const question = await repositories.question.create({
    description: title,
    unitId: topic.id,
    isForStudent
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

const deleteQuestion = async (req, res) => {
  const questionId = req.params.questionId;

  req.logger.info('deleting question %s', questionId);
  await repositories.question.deleteById(questionId);

  res.json({ ok: true });
};

module.exports = wrapRequests({
  getTopics,
  createUnit,
  getTopicById,
  deleteTopic,
  updateTopic,
  deleteQuestion
});
