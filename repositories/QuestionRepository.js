const exceptions = require('./exceptions');
const messages = require('../config/messages');
const errorCodes = require('../constants/databaseErrors');

class QuestionRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async create({ description, topicId, isForStudent }) {
    const fields = {
      description,
      topic_id: topicId,
      is_for_student: isForStudent
    };

    const [entity] = await this.connection
      .insert(fields, ['*'])
      .into('question');

    return entity;
  }

  deleteById(questionId) {
    return this.connection
      .transaction(async trx => {
        await trx('alternative').where('question_id', questionId).del();
        await trx('question').where('id', questionId).del();
        return trx.commit();
      })
      .catch(err => {
        if (err.code === errorCodes.FOREIGN_KEY_CONSTRAINT) {
          const reason = messages.question.canNotDeleteQuestion;
          throw new exceptions.EntityWithDependenciesError(reason);
        }

        throw err;
      });
  }
}

module.exports = QuestionRepository;
