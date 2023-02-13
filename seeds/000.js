const data = require('./data/data_000.json');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  await knex('grade').insert(data.grades);
  await knex('letter').insert(data.letters);
  await knex('user').insert(data.users);
};
