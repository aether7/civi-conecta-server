class StudentRepository {
  constructor(connection) {
    this.connection = connection;
  }

  async findOrCreate(student) {
    const result = await this.findOneByRun(student.run);

    if (result) {
      return result;
    }

    return this.create(student);
  }

  findOneByRun(run) {
    return this.connection
      .select()
      .from('student')
      .where('run', run)
      .first();
  }

  async create(student) {
    const [result] = await this.connection
      .insert({
        name: student.name,
        run: student.run
      }, ['*'])
      .into('student');

    return result;
  }
}

module.exports = StudentRepository;
