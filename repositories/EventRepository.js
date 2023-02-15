class EventRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findByGradeId(gradeId, isException) {
    return this.connection
      .select()
      .from('event')
      .where('grade_id', gradeId)
      .where('is_exception', isException)
      .debug();
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
