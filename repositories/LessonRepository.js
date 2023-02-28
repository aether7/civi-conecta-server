class LessonRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findById(lessonId) {
    return this.connection
      .column({
        id: 'lesson.id',
        number: 'lesson.number',
        description: 'lesson.description',
        grade: 'grade.level',
        objective: 'lesson.objective',
        topic: 'planning.topic',
        start_activity: 'planning.start_activity',
        main_activity: 'planning.main_activity',
        end_activity: 'planning.end_activity',
        teacher_material: 'planning.teacher_material',
        student_material: 'planning.student_material',
        keywords: 'planning.keywords'
      })
      .from('lesson')
      .innerJoin('planning', 'planning.lesson_id', 'lesson.id')
      .leftJoin('unit', 'lesson.unit_id', 'unit.id')
      .leftJoin('grade', 'unit.grade_id', 'grade.id')
      .where('lesson.id', lessonId)
      .first().debug();
  }

  async create(payload) {
    const fields = {
      number: payload.number,
      objective: payload.objective,
      description: payload.description,
      unit_id: payload.unitId,
      event_id: payload.eventId
    };

    const [result] = await this.connection
      .insert(fields, ['*'])
      .into('lesson');

    return result;
  }

  findFTPDataById(lessonId) {
    return this.connection
      .column({
        alias: 'grade.alias',
        unit_number: 'unit.number',
        lesson_number: 'lesson.number'
      })
      .from('lesson')
      .innerJoin('unit', 'lesson.unit_id', 'unit.id')
      .innerJoin('grade', 'unit.grade_id', 'grade.id')
      .where('lesson.id', lessonId)
      .first();
  }
}

module.exports = LessonRepository;
