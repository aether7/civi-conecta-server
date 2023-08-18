/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.alterTable('document', (t) => {
    t.dropColumn('alias');
    t.dropColumn('mimetype');
    t.dropColumn('filesize');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function() {

};
