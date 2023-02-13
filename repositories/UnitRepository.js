class UnitRepository {
  constructor(connection) {
    this.connection = connection;
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

  findSortedUnitsByGradeId(gradeId) {
    return Units.find({ grade: gradeId })
      .sort({ number: 1 })
      .populate({ path: 'grade', select: '-_id -__v' })
      .populate({ path: 'topic', select: '-_id -__v' });
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

  update(number, gradeId, fieldsToUpdate) {
    const query = { number, grade: gradeId };
    const options = { new: true, runValidators: true, context: 'query' };
    return Units.findOneAndUpdate(query, fieldsToUpdate, options);
  }

  remove(unitId) {
    return this.connection('unit')
      .where('id', unitId)
      .del();
  }
}

module.exports = UnitRepository;
