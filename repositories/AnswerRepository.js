class AnswerRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async save(feedbackId, alternativeId) {
    let result = await this.connection
      .select()
      .from('answer')
      .where('feedback_id', feedbackId)
      .where('alternative_id', alternativeId)
      .first();

    if (result) {
      return this._update(result.id, alternativeId);
    }

    return this._insert(feedbackId, alternativeId);
  }

  async _update(id, alternativeId) {
    const fields = { alternative_id: alternativeId };

    const [result] = await this.connection('answer')
      .where('id', id)
      .update(fields, ['*']);

    return result;
  }

  async _insert(feedbackId, alternativeId) {
    const fields = {
      alternative_id: alternativeId,
      feedback_id: feedbackId
    };

    const [result] = await this.connection
      .insert(fields, ['*'])
      .into('answer');

    return result;
  }
}

module.exports = AnswerRepository;
