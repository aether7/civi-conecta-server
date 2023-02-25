class UnitRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findById(id) {
    return this.connection
      .select()
      .from('unit')
      .where('id', id)
      .first();
  }

  findByGradeId(gradeId) {
    return this.connection
      .select()
      .from('unit')
      .where('grade_id', gradeId)
      .orderBy('id');
  }

  findOneByNumberAndGradeId(number, gradeId) {
    return this.connection
      .select()
      .from('unit')
      .where('grade_id', gradeId)
      .where('number', number)
      .first();
  }

  async create({ number, title, description, gradeId, topicId }) {
    const fields = {
      number,
      title,
      description,
      grade_id: gradeId,
      topic_id: topicId
    };

    const [result] = await this.connection
      .insert(fields, ['*'])
      .into('unit');

    return result;
  }

  async update(number, gradeId, fieldsToUpdate) {
    const fields = {
      title: fieldsToUpdate.title,
      description: fieldsToUpdate.description,
      topic_id: fieldsToUpdate.topicId
    };

    const [entity] = await this.connection('unit')
      .where('grade_id', gradeId)
      .where('number', number)
      .update(fields, ['*']);

    return entity;
  }

  remove(unitId) {
    return this.connection('unit')
      .where('id', unitId)
      .del();
  }
}

module.exports = UnitRepository;
