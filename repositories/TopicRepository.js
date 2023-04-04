const exceptions = require('./exceptions');
const messages = require('../config/messages');
const knex = require('knex');

class TopicRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findAll() {
    return this.connection
      .select('topic.*')
      .from('topic')
      .orderBy('topic.id');
  }

  findById(topicId) {
    return this.connection
      .select()
      .from('topic')
      .where('id', topicId)
      .first();
  }

  findByIdWithData(topicId, isForStudent) {
    return this.connection
      .column({
        topic_id: 'topic.id',
        topic_title: 'topic.title',
        question_id: 'question.id',
        alternative_id: 'alternative.id',
        question_description: 'question.description',
        alternative_letter: 'alternative.letter',
        alternative_description: 'alternative.description',
        alternative_value: 'alternative.value'
      })
      .from('topic')
      .leftJoin('question', 'question.topic_id', 'topic.id')
      .leftJoin('alternative', 'alternative.question_id', 'question.id')
      .where('topic.id', topicId)
      .where('question.is_for_student', isForStudent);
  }

  async create(title, number) {
    let result = await this.connection
      .select()
      .from('topic')
      .where('title', title)
      .first();

    if (result) {
      const message = messages.topic.topicAlreadyExists.replace('{}', title);
      throw new exceptions.EntityAlreadyExistsError(message);
    }

    const fields = { title, number };

    [result] = await this.connection
      .insert(fields, ['*'])
      .into('topic');

    return result;
  }

  async countAssociatedQuestionsByTopicId(topicId) {
    const results = await this.connection
      .count({ quantity: 'question.id' })
      .from('question')
      .where('topic_id', topicId)
      .first();

    return Number.parseInt(results.quantity);
  }

  deleteById(topicId) {
    return this.connection('topic')
      .where('id', topicId)
      .del();
  }

  findByQuestionId(questionId) {
    return this.connection
      .select('topic.*')
      .from('topic')
      .innerJoin('question', 'topic.id', 'question.topic_id')
      .where('question.id', questionId)
      .first();
  }

  triggerUpdateAt(topicId) {
    const now = new Date().toISOString()
      .replace('T', ' ')
      .replace(/\.\d+Z$/, '');

    return this.connection('topic')
      .update('updated_at', now)
      .where('id', topicId);
  }
}

module.exports = TopicRepository;
