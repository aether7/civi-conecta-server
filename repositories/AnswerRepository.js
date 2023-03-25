class AnswerRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async findByAlias(uuid) {
    const results = await this._findTeacherAlternativesByAlias(uuid);

    if (results.length) {
      return results;
    }

    return this._findStudentAlternativesByAlias(uuid);
  }

  async save(feedbackId, questionId, alternativeId) {
    const result = await this._findByFeedbackAndQuestion(feedbackId, questionId);
    return result ?
      this._update(result.id, alternativeId) :
      this._insert(feedbackId, alternativeId);
  }

  _findTeacherAlternativesByAlias(uuid) {
    return this.connection
      .select('alternative.*')
      .from('answers_by_person')
      .innerJoin('answer', 'answers_by_person.id', 'answer.id')
      .innerJoin('alternative', 'answer.alternative_id', 'alternative.id')
      .innerJoin('user', 'answers_by_person.teacher_id', 'user.id')
      .where('user.uuid', uuid);
  }

  _findStudentAlternativesByAlias(uuid) {
    return this.connection
      .select('alternative.*')
      .from('answers_by_person')
      .innerJoin('answer', 'answers_by_person.id', 'answer.id')
      .innerJoin('alternative', 'answer.alternative_id', 'alternative.id')
      .innerJoin('student', 'answers_by_person.student_id', 'student.id')
      .where('student.uuid', uuid);
  }

  _findByFeedbackAndQuestion(feedbackId, questionId) {
    return this.connection
      .select('answer.id')
      .from('answer')
      .innerJoin('alternative', 'answer.alternative_id', 'alternative.id')
      .innerJoin('question', 'alternative.question_id', 'question.id')
      .where('answer.feedback_id', feedbackId)
      .where('question.id', questionId)
      .first();
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
