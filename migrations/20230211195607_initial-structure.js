/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('user', (t) => {
    t.increments('id', { primaryKey: true });
    t.string('uuid');
    t.string('name');
    t.string('email');
    t.string('password');
    t.integer('encrypted_password');
    t.integer('active').defaultTo(1);
    t.string('role');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('grade', (t) => {
    t.increments('id', { primaryKey: true });
    t.string('level');
    t.string('alias');
    t.integer('units_quantity').defaultTo(4);
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('letter', (t) => {
    t.increments('id', { primaryKey: true });
    t.string('character');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('establishment', (t) => {
    t.increments('id', { primaryKey: true });
    t.string('name');
    t.integer('active').defaultTo(1);
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('student', (t) => {
    t.increments('id', { primaryKey: true });
    t.string('uuid');
    t.string('name');
    t.string('run');
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.unique(['run'], { indexName: 'student_idx1' });
  });

  await knex.schema.createTable('course', (t) => {
    t.increments('id', { primaryKey: true });
    t.integer('letter_id').unsigned();
    t.integer('establishment_id').unsigned();
    t.integer('grade_id').unsigned();
    t.integer('teacher_id').unsigned();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.foreign('letter_id').references('letter.id');
    t.foreign('establishment_id').references('establishment.id');
    t.foreign('teacher_id').references('user.id');
    t.foreign('grade_id').references('grade.id');
  });

  await knex.schema.createTable('course_student', (t) => {
    t.increments('id', { primaryKey: true });
    t.integer('course_id').unsigned();
    t.integer('student_id').unsigned();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.foreign('course_id').references('course.id');
    t.foreign('student_id').references('student.id');
  });

  await knex.schema.createTable('survey', (t) => {
    t.increments('id', { primaryKey: true });
    t.enu('type', ['student', 'teacher']);
    t.integer('grade_id').unsigned();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.foreign('grade_id').references('grade.id');
  });

  await knex.schema.createTable('topic', (t) => {
    t.increments('id', { primaryKey: true });
    t.string('title');
    t.integer('number').unsigned();
    t.integer('survey_id').unsigned();
    t.integer('grade_id').unsigned();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.foreign('survey_id').references('survey.id');
    t.foreign('grade_id').references('grade.id');
  });

  await knex.schema.createTable('question', (t) => {
    t.increments('id', { primaryKey: true });
    t.string('description');
    t.integer('topic_id').unsigned();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.foreign('topic_id').references('topic.id');
  })

  await knex.schema.createTable('alternative', (t) => {
    t.increments('id', { primaryKey: true });
    t.string('letter');
    t.string('description');
    t.integer('value');
    t.integer('question_id').unsigned();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.foreign('question_id').references('question.id');
    t.index(['letter'], 'alternative_idx01');
  });

  await knex.schema.createTable('feedback_course', (t) => {
    t.increments('id', { primaryKey: true });
    t.string('uuid');
    t.integer('is_finished').defaultTo(0);
    t.integer('course_id').unsigned();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.foreign('course_id').references('course.id');
  });

  await knex.schema.createTable('feedback', (t) => {
    t.increments('id', { primaryKey: true });
    t.integer('is_finished').defaultTo(0);
    t.integer('student_id').unsigned();
    t.integer('teacher_id').unsigned();
    t.integer('feedback_course_id').unsigned();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.foreign('student_id').references('student.id');
    t.foreign('teacher_id').references('user.id');
    t.foreign('feedback_course_id').references('feedback_course.id');
  });

  await knex.schema.createTable('answer', (t) => {
    t.increments('id', { primaryKey: true });
    t.integer('feedback_id').unsigned();
    t.integer('alternative_id').unsigned();
    t.foreign('feedback_id').references('feedback.id');
    t.foreign('alternative_id').references('alternative.id');
  });

  await knex.schema.createTable('unit', (t) => {
    t.increments('id', { primaryKey: true });
    t.integer('number');
    t.string('title');
    t.string('description');
    t.integer('grade_id').unsigned();
    t.integer('topic_id').unsigned();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.foreign('grade_id').references('grade.id');
    t.foreign('topic_id').references('topic.id');
  });

  await knex.schema.createTable('event_type', (t) => {
    t.increments('id', { primaryKey: true });
    t.string('name');
  });

  await knex.schema.createTable('event', (t) => {
    t.increments('id', { primaryKey: true });
    t.string('title');
    t.text('description');
    t.string('date');
    t.integer('event_type_id').unsigned();
    t.integer('grade_id').unsigned();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.foreign('event_type_id').references('event_type.id');
    t.foreign('grade_id').references('grade.id');
  });

  await knex.schema.createTable('lesson', (t) => {
    t.increments('id', { primaryKey: true });
    t.integer('number');
    t.string('objective');
    t.text('description');
    t.integer('unit_id').unsigned();
    t.integer('event_id').unsigned();
    t.foreign('unit_id').references('unit.id');
    t.foreign('event_id').references('event.id');
  });

  await knex.schema.createTable('planning', (t) => {
    t.increments('id', { primaryKey: true });
    t.text('topic');
    t.string('keywords');
    t.text('start_activity');
    t.text('main_activity');
    t.text('end_activity');
    t.string('teacher_material');
    t.string('student_material');
    t.integer('lesson_id').unsigned();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.foreign('lesson_id').references('lesson.id');
  });

  await knex.schema.createTable('document', (t) => {
    t.increments('id', { primaryKey: true });
    t.string('alias');
    t.string('filename');
    t.string('filepath');
    t.string('mimetype');
    t.integer('filesize');
    t.integer('lesson_id').unsigned();
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.foreign('lesson_id').references('lesson.id');
  });

  await knex.schema.createView('questions_quantity', (view) => {
    view.as(
      knex
        .select('survey.type')
        .count({ quantity: 'question.id' })
        .from('survey')
        .innerJoin('topic', 'topic.survey_id', 'survey.id')
        .innerJoin('question', 'question.topic_id', 'topic.id')
        .groupBy('survey.type')
    );
  });

  await knex.schema.createView('answers_by_person', (view) => {
    view.as(
      knex
        .select(
          'feedback_course.uuid',
          'answer.id',
          'feedback.teacher_id',
          'feedback.student_id'
        )
        .from('feedback_course')
        .innerJoin('feedback', 'feedback.feedback_course_id', 'feedback_course.id')
        .innerJoin('answer', 'answer.feedback_id', 'feedback.id')
    );
  });

  await knex.seed.run();
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function () {

};
