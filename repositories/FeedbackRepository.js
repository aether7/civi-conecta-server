class FeedbackRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async findOrCreateByType(type, alias) {
    const result = await this.findByTypeAndAlias(type, alias);

    if (result) {
      return result;
    }

    return this.createByType(type, alias);
  }

  findByTypeAndAlias(type, alias) {
    let builder = this.connection
      .select('feedback.*')
      .from('feedback')

    if (type === 'student') {
      builder.innerJoin('student', 'feedback.student_id', 'student.id');
      builder.where('student.uuid', alias);
    } else {
      builder.innerJoin('user', 'feedback.teacher_id', 'user.id');
      builder.where('user.uuid', alias);
    }

    builder.first();
    return builder;
  }

  async createByType(type, alias) {
    if (type === 'student') {
      return this._createStudentFeedback(alias);
    }

    return this._createTeacherFeedback(alias);
  }

  async _createStudentFeedback(alias) {
    const result = await this.connection
      .select('id')
      .from('student')
      .where('uuid', alias)
      .first();

    const fields = {
      student_id: result.id,
      is_finished: 0
    };

    return this.connection.insert(fields, ['*']).into('feedback');
  }

  async _createTeacherFeedback(alias) {
    const result = await this.connection
      .select('id')
      .from('user')
      .where('uuid', alias)
      .first();

    const fields = {
      teacher_id: result.id,
      is_finished: 0
    };

    return this.connection.insert(fields, ['*']).into('feedback');
  }
}

module.exports = FeedbackRepository;
