class AlternativeRepository {
  constructor(connection) {
    this.connection = connection;
  }

  findByQuestionAndLetter(questionId, letter) {
    return this.connection
      .select('alternative.*')
      .from('alternative')
      .innerJoin('question', 'alternative.question_id', 'question.id')
      .where('question.id', questionId)
      .where('alternative.letter', letter)
      .first();
  }

  async create({ letter, description, value, questionId }) {
    const fields = {
      letter,
      description,
      value,
      question_id: questionId
    };

    const [entity] = await this.connection
      .insert(fields, ['*'])
      .into('alternative');

    return entity;
  }
}

module.exports = AlternativeRepository;
