const exceptions = require('./exceptions');
const messages = require('../config/messages');
const knex = require('knex');

class TopicRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findAll() {
    return this.connection
      .select('unit.*')
      .from('unit')
      .orderBy('unit.id');
  }

  findById(unitId) {
    return this.connection
      .select()
      .from('unit')
      .where('id', unitId)
      .first();
  }

  findByGradeId(gradeId) {
    return this.connection
      .select()
      .from('unit')
      .where('grade_id', gradeId)
      .orderBy('id');
  }

  findByIdWithData(unitId, isForStudent) {
    return this.connection
      .column({
        unit_id: 'unit.id',
        unit_title: 'unit.title',
        question_id: 'question.id',
        alternative_id: 'alternative.id',
        question_description: 'question.description',
        alternative_letter: 'alternative.letter',
        alternative_description: 'alternative.description',
        alternative_value: 'alternative.value'
      })
      .from('unit')
      .leftJoin('question', 'question.unit_id', 'unit.id')
      .leftJoin('alternative', 'alternative.question_id', 'question.id')
      .where('unit.id', unitId)
      .where('question.is_for_student', isForStudent);
  }

  async countAssociatedQuestionsByTopicId(topicId) {
    const results = await this.connection
      .count({ quantity: 'question.id' })
      .from('question')
      .where('unit_id', topicId)
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
