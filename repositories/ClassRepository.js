class ClassRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findOneByNumberAndUnitId(number, unitId) {
    const queryClass = { number, unit: unitId };
    return Classes.findOne(queryClass);
  }

  async findByUnitId(unitId) {
    return this.connection
      .select()
      .from('class')
      .where('unit_id', unitId);
  }

  async findOneByUnitId(unitId) {
    // const query = { unit: unitId };
    // const entity = await Classes.findOne(query);

    // if (!entity) {
    //   throw new EntityNotFoundError(`no existe la unidad ${unitId}`);
    // }

    // return entity;
  }

  findOneAndPopulate(number, unitId) {
    const cls = this.findOneByNumberAndUnitId(number, unitId);
    const populatedCls = this.populate(cls);
    return populatedCls;
  }

  create({ number, title, description, objetives, planning, unitId }) {
    return Classes.create({
      number,
      title,
      description,
      objetives,
      planning,
      unit: unitId
    });
  }

  populate(cls) {
    const select = '-_id -__v';
    const popGrade = { path: 'grade', select };
    const popTopic = { path: 'topic', select };
    const populate = [popGrade, popTopic];
    const popUnit = { path: 'unit', select, populate };
    return cls.populate(popUnit);
  }
}

module.exports = ClassRepository;
