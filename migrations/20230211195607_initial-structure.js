/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex
    .schema
    .createTable('user', (t) => {
      t.increments('id', { primaryKey: true });
      t.string('name');
      t.string('email');
      t.string('password');
      t.boolean('encrypted_password');
      t.boolean('active').defaultTo(true);
      t.string('role');
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('grade', (t) => {
      t.increments('id', { primaryKey: true });
      t.string('level');
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('letter', (t) => {
      t.increments('id', { primaryKey: true });
      t.string('character');
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('establishment', (t) => {
      t.increments('id', { primaryKey: true });
      t.string('name');
      t.boolean('active').defaultTo(true);
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('student', (t) => {
      t.increments('id', { primaryKey: true });
      t.string('name');
      t.string('run');
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
      t.unique(['run'], { indexName: 'student_idx1' });
    })
    .createTable('topic', (t) => {
      t.increments('id', { primaryKey: true });
      t.string('title');
      t.integer('number').unsigned();
      t.integer('grade_id').unsigned();
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
      t.foreign('grade_id').references('grade.id');
      t.unique(['number'], { indexName: 'topic_idx1' });
    })
    .createTable('course', (t) => {
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
    })
    .createTable('course_student', (t) => {
      t.increments('id', { primaryKey: true });
      t.integer('course_id').unsigned();
      t.integer('student_id').unsigned();
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
      t.foreign('course_id').references('course.id');
      t.foreign('student_id').references('student.id');
    })
    .createTable('unit', (t) => {
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
    })
    .createTable('planning', (t) => {
      t.increments('id', { primaryKey: true });
      t.text('topic');
      t.string('keywords');
      t.text('start_activity');
      t.text('main_activity');
      t.text('end_activity');
      t.string('teacher_material');
      t.string('student_material');
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('survey', (t) => {
      t.increments('id', { primaryKey: true });
      t.integer('number');
      t.enu('type', ['student', 'teacher']);
      t.string('topic');
      t.integer('grade_id').unsigned();
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
      t.foreign('grade_id').references('grade.id');
    })
    .createTable('question', (t) => {
      t.increments('id', { primaryKey: true });
      t.string('description');
      t.integer('survey_id').unsigned();
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
      t.foreign('survey_id').references('survey.id');
    })
    .createTable('choice', (t) => {
      t.increments('id', { primaryKey: true });
      t.string('letter');
      t.string('description');
      t.integer('value');
      t.integer('question_id').unsigned();
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
      t.foreign('question_id').references('question.id');
    })
    .createTable('event_type', (t) => {
      t.increments('id', { primaryKey: true });
      t.string('name');
    })
    .createTable('event', (t) => {
      t.increments('id', { primaryKey: true });
      t.integer('number');
      t.string('title');
      t.string('objective');
      t.text('description');
      t.timestamp('date').defaultTo(knex.fn.now());
      t.integer('event_type_id').unsigned();
      t.integer('unit_id').unsigned();
      t.integer('grade_id').unsigned();
      t.integer('planning_id').unsigned();
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
      t.foreign('event_type_id').references('event_type.id');
      t.foreign('unit_id').references('unit.id');
      t.foreign('grade_id').references('grade.id');
      t.foreign('planning_id').references('planning.id');
    })
    .then(() => knex.seed.run());
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

};
