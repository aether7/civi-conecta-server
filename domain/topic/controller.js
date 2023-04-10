const { EventEmitter } = require('events');
const repositories = require('../../repositories');
const { wrapRequests } = require('../../helpers/controller');
const exceptions = require('../../repositories/exceptions');
const messages = require('../../config/messages');
const dto = require('./dto');

const emitter = new EventEmitter();

emitter.on('updatedAt', (topicId) => {
  (async function triggerUpdateAt() {
    await repositories.topic.triggerUpdateAt(topicId);
  })();
});

const getTopics = async (_, res) => {
  const topics = await repositories.topic.findAll();
  res.json({ ok: true, topics: topics.map(dto.mapTopic) });
};

const getTopicById = async (req, res) => {
  const topicId = req.params.topicId;
  const isForStudent = req.params.questionType === 'teacher' ? 0 : 1;
  const result = await repositories.topic.findByIdWithData(topicId, isForStudent);

  if (!result.length) {
    const topic = await repositories.topic.findById(topicId);
    return res.json({ ok: true, topic: dto.mapTopic(topic) });
  }

  res.json({ ok: true, topic: dto.mapTopicWithData(result) });
};

const createTopic = async (req, res) => {
  const title = req.body.title;
  let number = Number.parseInt(req.body.number);

  if (Number.isNaN(number)) {
    number = 1;
  }

  const topic = await repositories.topic.create(title, number);
  res.json({ ok: true, topic: dto.mapTopic(topic) });
};

const deleteTopic = async (req, res) => {
  const topicId = req.params.topicId;
  const quantity = await repositories.topic.countAssociatedQuestionsByTopicId(topicId);
  req.logger.info('trying to delete topic %s', topicId);

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
    topicId: topic.id,
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

  emitter.emit('updatedAt', topicId);
  res.json({ ok: true, question: dto.mapQuestion(question) });
};

const deleteQuestion = async (req, res) => {
  const topicId = req.params.topicId;
  const questionId = req.params.questionId;

  req.logger.info('deleting question %s', questionId);
  await repositories.question.deleteById(questionId);

  emitter.emit('updatedAt', topicId);
  res.json({ ok: true });
};

module.exports = wrapRequests({
  getTopics,
  createTopic,
  getTopicById,
  deleteTopic,
  updateTopic,
  deleteQuestion
});
