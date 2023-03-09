class PlanningRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async create(payload, lessonId) {
    const fields = {
      topic: payload.topic,
      start_activity: payload.startActivity,
      main_activity: payload.mainActivity,
      end_activity: payload.endActivity,
      teacher_material: payload.materials.teacher.join(','),
      student_material: payload.materials.student.join(','),
      keywords: payload.keywords.join(','),
      lesson_id: lessonId
    };

    const [entity] = await this.connection
      .insert(fields, ['*'])
      .into('planning');

    return entity;
  }

  deleteById(planningId) {
    return this.connection('planning')
      .where('id', planningId)
      .del();
  }

  findRelatedDataByEventId(eventId) {
    return this.connection
      .column({
        planning_id: 'planning.id',
        lesson_id: 'lesson.id',
        event_id: 'event.id'
      })
      .from('planning')
      .innerJoin('lesson', 'planning.lesson_id', 'lesson.id')
      .innerJoin('event', 'lesson.event_id', 'event.id')
      .where('event.id', eventId)
      .first();
  }
}

module.exports = PlanningRepository;
