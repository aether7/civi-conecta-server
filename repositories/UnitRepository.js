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

  findByIdWithData(id) {
    return this.connection
      .column({
        id: 'unit.id',
        number: 'unit.number',
        title: 'unit.title',
        description: 'unit.description',
        event_id: 'event.id',
        event_number: 'event.number',
        event_title: 'event.title',
        event_objective: 'event.objective',
        event_description: 'event.description',
        event_date: 'event.date',
        planning_id: 'planning.id',
        planning_topic: 'planning.topic',
        planning_keywords: 'planning.keywords',
        planning_start_activity: 'planning.start_activity',
        planning_main_activity: 'planning.main_activity',
        planning_end_activity: 'planning.end_activity',
        planning_teacher_material: 'planning.teacher_material',
        planning_student_material: 'planning.student_material'
      })
      .from('unit')
      .leftJoin('event', 'event.unit_id', 'unit.id')
      .leftJoin('planning', 'planning.event_id', 'event.id')
      .where('unit.id', id);
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
