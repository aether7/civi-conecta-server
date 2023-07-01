/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('course_unit', (t) => {
    t.increments('id');
    t.integer('status').defaultTo(0);
    t.integer('course_id').unsigned();
    t.integer('unit_id').unsigned();
    t.foreign('course_id').references('course.id');
    t.foreign('unit_id').references('unit.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

};
