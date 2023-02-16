class EventRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findByGradeId(gradeId, isException) {
    return this.connection
      .column({
        id: 'event.id',
        number: 'event.number',
        title: 'event.title',
        description: 'event.description',
        date: 'event.date',
        grade: 'grade.level',
        objectives: 'event.objective',
        topic: 'planning.topic',
        start_activity: 'planning.start_activity',
        main_activity: 'planning.main_activity',
        end_activity: 'planning.end_activity',
        teacher_material: 'planning.teacher_material',
        student_material: 'planning.student_material',
        keywords: 'planning.keywords'
      })
      .from('event')
      .innerJoin('planning', 'event.planning_id', 'planning.id')
      .innerJoin('grade', 'event.grade_id', 'grade.id')
      .where('event.grade_id', gradeId)
      .where('event.is_exception', isException);
  }

  async create(payload) {
    const match = /(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})/.exec(payload.date);
    const date = new Date();
    date.setFullYear(Number.parseInt(match.groups.year));
    date.setMonth(Number.parseInt(match.groups.month) - 1);
    date.setDate(Number.parseInt(match.groups.day));

    const fields = {
      number: payload.number,
      title: payload.title,
      description: payload.description,
      objective: payload.objective,
      is_exception: payload.isException,
      grade_id: payload.gradeId,
      planning_id: payload.planningId,
      date
    };

    const [entity] = await this.connection
      .insert(fields, ['*'])
      .into('event');

    return entity;
  }
}

module.exports = EventRepository;
