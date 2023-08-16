class LessonRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findById(lessonId) {
    return this.connection
      .column({
        id: 'lesson.id',
        number: 'lesson.number',
        unit_number: 'unit.number',
        title: 'unit.title',
        date: 'event.date',
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
      .leftJoin('event', 'lesson.event_id', 'event.id')
      .where('lesson.id', lessonId)
      .first();
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

  async findFTPDataById(lessonId) {
    const lesson = await this.connection
      .select()
      .from('lesson')
      .where('id', lessonId)
      .first();

    return lesson.unit_id ?
      this._findGradeDataByUnit(lessonId) :
      this._findGradeDataByEvent(lessonId);
  }

  _findGradeDataByUnit(lessonId) {
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

  _findGradeDataByEvent(lessonId) {
    return this.connection
      .column({
        alias: 'grade.alias',
        event_number: 'event.id'
      })
      .from('lesson')
      .innerJoin('event', 'lesson.event_id', 'event.id')
      .innerJoin('grade', 'event.grade_id', 'grade.id')
      .where('lesson.id', lessonId)
      .first();
  }

  async deleteById(lessonId) {
    await this.connection('document')
      .where('lesson_id', lessonId)
      .del();

    return this.connection('lesson')
      .where('id', lessonId)
      .del();
  }

  async countAssociatedLessonsByUnitId(unitId) {
    const results = await this.connection
      .count({ quantity: 'lesson.id' })
      .from('lesson')
      .where('unit_id', unitId)
      .first();

    return Number.parseInt(results.quantity);
  }

  findByUnitId(unitId) {
    return this.connection
      .select()
      .from('lesson')
      .where('unit_id', unitId)
      .orderBy('id');
  }

  findByEventId(eventId) {
    return this.connection
      .select('lesson.*')
      .column({ date: 'event.date' })
      .from('lesson')
      .innerJoin('event', 'lesson.event_id', 'event.id')
      .where('event_id', eventId)
      .first();
  }

  async updatePlanning(data, lessonId) {
    const planningFields = {
      topic: data.topic,
      keywords: data.keywords.join(','),
      student_material: data.studentMaterials.join(','),
      teacher_material: data.teacherMaterials.join(','),
      start_activity: data.startActivity,
      main_activity: data.mainActivity,
      end_activity: data.endActivity
    };

    const lessonFields = {
      description: data.description,
      objective: data.objective
    };

    const updatePlanning = this.connection('planning')
      .where('lesson_id', lessonId)
      .update(planningFields);

    const updateLesson = this.connection('lesson')
      .where('id', lessonId)
      .update(lessonFields);

    await Promise.all([updatePlanning,updateLesson]);

    if (data.date) {
      const event = await this.connection
        .select('event.id')
        .from('lesson')
        .innerJoin('event', 'lesson.event_id', 'event.id')
        .where('lesson.id', lessonId)
        .first();

      await this.connection('event')
        .where('id', event.id)
        .update('date', data.date);
    }
  }
}

module.exports = LessonRepository;
