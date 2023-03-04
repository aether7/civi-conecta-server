class DocumentRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findByUnitId(unitId) {
    return this.connection
      .select('document.*')
      .from('document')
      .innerJoin('lesson', 'document.lesson_id', 'lesson.id')
      .innerJoin('unit', 'lesson.unit_id', 'unit.id')
      .where('unit.id', unitId);
  }

  findByLesson(lessonId) {
    return this.connection
      .select()
      .from('document')
      .where('lesson_id', lessonId);
  }

  findByAlias(aliasId) {
    return this.connection
      .select()
      .from('document')
      .where('alias', aliasId)
      .first();
  }

  async create(data) {
    const fields = {
      alias: data.alias,
      filename: data.filename,
      filepath: data.filepath,
      filesize: data.filesize,
      mimetype: data.mimetype,
      lesson_id: data.lessonId
    };

    const [result] = await this.connection
      .insert(fields, ['*'])
      .into('document');

    return result;
  }

  remove(id) {
    return this.connection('document')
      .where('id', id)
      .del();
  }
}

module.exports = DocumentRepository;
