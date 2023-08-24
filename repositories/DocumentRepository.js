class DocumentRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async createLink(lessonId, { filepath, filename }) {
    const fields = {
      filepath,
      filename,
      lesson_id: lessonId
    };

    const [row] = await this.connection.insert(fields, ['id']).into('document');
    return row.id;
  }

  editLink(id, { filepath, filename }) {
    const fields = {
      filepath,
      filename,
      updated_at: new Date()
    };

    return this.connection('document')
      .where('id', id)
      .update(fields);
  }

  removeLink(id) {
    return this.connection('document')
      .where('id', id)
      .del();
  }

  findByUnitId(unitId) {
    return this.connection
      .select('document.*')
      .from('document')
      .innerJoin('lesson', 'document.lesson_id', 'lesson.id')
      .innerJoin('unit', 'lesson.unit_id', 'unit.id')
      .where('unit.id', unitId);
  }

  findByEvent(eventId) {
    return this.connection
      .select('document.*')
      .column({ eventId: 'event.id' })
      .from('document')
      .innerJoin('lesson', 'document.lesson_id', 'lesson.id')
      .innerJoin('event', 'lesson.event_id', 'event.id')
      .where('event.id', eventId)
      .orderBy('document.id');
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

  async findFolderPathFromLesson(lessonId) {
    const result = await this.connection
      .select()
      .from('document')
      .where('lesson_id', lessonId)
      .first();

    return result.filepath.split('/').slice(0, -1).join('/');
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

  deleteByLessonId(lessonId) {
    return this.connection('document')
      .where('lesson_id', lessonId)
      .del();
  }
}

module.exports = DocumentRepository;
