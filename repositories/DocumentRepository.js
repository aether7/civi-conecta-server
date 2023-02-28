class DocumentRepository {
  constructor(connection) {
    this.connection = connection;
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
}

module.exports = DocumentRepository;
