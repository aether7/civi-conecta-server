class CourseUnitRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findByUnitAndTeacher(unitId, uuid) {
    return this.connection
      .select()
      .from('course_unit')
      .innerJoin('course', 'course_unit.course_id', 'course.id')
      .innerJoin('public.user', 'course.teacher_id', 'public.user.id')
      .where('unit_id', unitId)
      .where('public.user.uuid', uuid)
      .first();
  }

  updateStatusById(courseUnitId, newStatus) {
    return this.connection('course_unit')
      .where('id', courseUnitId)
      .update('status', newStatus);
  }

  async findOrCreateByCourseId(courseId) {
    const results = await this.connection
      .select()
      .from('course_unit')
      .where('course_id', courseId);

    if (results.length) {
      return results;
    }

    return this._createCourseUnits(courseId);
  }

  async _createCourseUnits(courseId) {
    const units = await this.connection
      .select('unit.*')
      .from('course')
      .innerJoin('grade', 'course.grade_id', 'grade.id')
      .innerJoin('unit', 'unit.grade_id', 'grade.id')
      .where('course.id', courseId);

    for (const unit of units) {
      await this.connection
        .insert({ unit_id: unit.id, course_id: courseId })
        .into('course_unit');
    }
  }
}

module.exports = CourseUnitRepository;
