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

  deleteByEventId(lessonId) {
    return this.connection('planning')
      .where('lesson_id', lessonId)
      .del();
  }
}

module.exports = PlanningRepository;
