class PlanningRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async create(payload, eventId) {
    const fields = {
      topic: payload.topic,
      start_activity: payload.startActivity,
      main_activity: payload.mainActivity,
      end_activity: payload.endActivity,
      teacher_material: payload.materials.teacher.join(','),
      student_material: payload.materials.student.join(','),
      keywords: payload.keywords.join(','),
      event_id: eventId
    };

    const [entity] = await this.connection
      .insert(fields, ['*'])
      .into('planning');

    return entity;
  }

  deleteByEventId(eventId) {
    return this.connection('planning')
      .where('event_id', eventId)
      .del();
  }
}

module.exports = PlanningRepository;
