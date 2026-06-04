/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up (knex) {
  return knex.schema.table('loan', (table) => {
    table.timestamp('archived_at')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down (knex) {
  return knex.schema.table('loan', (table)=> {
    table.dropColumn('archived_at')
  })
};
