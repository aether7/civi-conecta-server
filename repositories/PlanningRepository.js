class PlanningRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async create(payload) {
    const fields = {
      topic: payload.topic,
      start_activity: payload.startActivity,
      main_activity: payload.mainActivity,
      end_activity: payload.endActivity,
      teacher_material: payload.materials.teacher.join(','),
      student_material: payload.materials.student.join(','),
      keywords: payload.keywords.join(',')
    };

    const [entity] = await this.connection
      .insert(fields, ['*'])
      .into('planning');

    return entity;
  }
}

module.exports = PlanningRepository;
