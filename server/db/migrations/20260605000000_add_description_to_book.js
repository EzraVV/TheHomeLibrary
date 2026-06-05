/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema.table('book', (table) => {
    table.text('description')
  })
}

/**
 * @param {import('knex').Knex} knex
 */
export async function down(knex) {
  return knex.schema.table('book', (table) => {
    table.dropColumn('description')
  })
}
