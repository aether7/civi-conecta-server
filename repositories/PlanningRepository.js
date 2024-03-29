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
      lesson_id: lessonId
    };

    if (payload.keywords) {
      fields.keywords = payload.keywords.join(',');
    }

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
      .from('event')
      .leftJoin('lesson', 'lesson.event_id', 'event.id')
      .leftJoin('planning', 'planning.lesson_id', 'lesson.id')
      .where('event.id', eventId)
      .first();
  }

  async deleteByLessonId(lessonId) {
    return this.connection('planning')
      .where('lesson_id', lessonId)
      .del();
  }
}

module.exports = PlanningRepository;
