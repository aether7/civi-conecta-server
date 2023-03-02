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
  const result = await repositories.topic.findByIdWithData(topicId);
  res.json({ ok: true, topic: dto.mapTopicWithData(result) });
};

const createTopic = async (req, res) => {
  const surveyType = req.params.surveyType;
  const title = req.body.title;
  const survey = await repositories.survey.findByType(surveyType);
  const topic = await repositories.topic.create(title, survey.id);
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

const updateTopic = async (req, res) => {
  const topicId = req.params.topicId;
  const title = req.body.title;
  const alternatives = req.body.alternatives;
  const topic = await repositories.topic.findById(topicId);

  req.logger.info('saving topic with questions %s', title);

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

const deleteQuestion = async (req, res) => {
  const questionId = req.params.questionId;
  await repositories.alternative.deleteByQuestionId(questionId);
  await repositories.question.deleteById(questionId);
  res.json({ ok: true });
};

module.exports = {
  getTopics,
  createTopic,
  getTopicById,
  deleteTopic: tryCatch(deleteTopic),
  updateTopic: tryCatch(updateTopic),
  deleteQuestion: tryCatch(deleteQuestion)
};
