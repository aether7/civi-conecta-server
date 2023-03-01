const repositories = require('../../repositories');
const { tryCatch } = require('../../helpers/controller');
const exceptions = require('../../repositories/exceptions');
const messages = require('../../config/messages');
const dto = require('./dto');

const getTopics = async (req, res) => {
  const surveyType = req.params.surveyType;
  const topics = await repositories.topic.findBySurveyType(surveyType);
  res.json({ ok: true, topics: topics.map(dto.mapTopic) });
};

const getTopicById = async (req, res) => {
  const topicId = req.params.topicId;
  const surveyType = req.params.surveyType;
  const result = await repositories.topic.findByIdWithData(topicId, surveyType);
  let topic;

  if (!result.length) {
    const t = await repositories.topic.findById(topicId);
    topic = dto.mapTopic(t);
  } else {
    topic = dto.mapTopicWithData(result)
  }

  res.json({ ok: true, topic });
};

const createTopic = async (req, res) => {
  const topicType = req.params.topicType;
  const title = req.body.title;
  const number = req.body.number;
  const topic = await repositories.topic.create(title, number);
  res.json({ ok: true, topic: dto.mapTopic(topic) });
};

const deleteTopic = async (req, res) => {
  const topicId = req.params.topicId;
  const groups = await repositories.topic.groupAssociatedQuestions(topicId);

  if (groups.student || groups.teacher) {
    const associatedGroups = [];

    if (groups.student) {
      associatedGroups.push(
        messages.topic.studentQuestions.replace('{}', groups.student)
      );
    }

    if (groups.teacher) {
      associatedGroups.push(
        messages.topic.teacherQuestions.replace('{}', groups.teacher)
      );
    }

    const associatedQuestions = associatedGroups.join(' y ');
    const message = messages.topic.canNotDeleteTopic.replace('{}', associatedQuestions);

    throw new exceptions.TopicWithAssociatedQuestionsError(message);
  }

  await repositories.survey.deleteByTopicId(topicId);
  await repositories.topic.deleteById(topicId);
  res.json({ ok: true });
};

module.exports = {
  getTopics,
  createTopic,
  getTopicById,
  deleteTopic: tryCatch(deleteTopic)
};
