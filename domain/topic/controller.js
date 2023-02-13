const repositories = require('../../repositories');
const dto = require('./dto');

const getTopics = async (_, res) => {
  const topics = await repositories.topic.findAll();
  res.json({ ok: true, topics: topics.map(dto.mapTopic) });
};

const createTopic = async (req, res) => {
  const title = req.body.title;
  const number = req.body.number;
  const topic = await repositories.topic.create(title, number);
  res.json({ ok: true, topic: dto.mapTopic(topic) });
};

module.exports = {
  getTopics,
  createTopic
};
