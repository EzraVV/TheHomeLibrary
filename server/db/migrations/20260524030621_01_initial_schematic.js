import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  '01_user.sql',
  '02_book.sql',
  '03_book_images.sql',
  '04_loan.sql',
  '05_condition_report.sql',
  '06_book_review.sql',
  '07_user_review.sql',
  '08_follows.sql'
]


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up (knex) {
  for (const file of files) {
    const rawSql = fs.readFileSync(path.join(__dirname, '../schema', file), 'utf8')
    
    // Split the file by semicolons to execute statements individually
    const statements = rawSql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    console.log(`Processing ${file} (${statements.length} statements found)...`);

    for (const statement of statements) {
      try {
        await knex.raw(statement);
      } catch (error) {
        console.error(`Error in file ${file} on statement: \n"${statement}"`);
        throw error; // Halts migration and surfaces syntax error
      }
    }
  }
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // 1. Disable foreign key checks temporarily 
  await knex.raw('PRAGMA foreign_keys = OFF;')

  // 2. Drop tables in reverse order using native Knex syntax
  await knex.schema.dropTableIfExists('follows')
  await knex.schema.dropTableIfExists('user_review')
  await knex.schema.dropTableIfExists('book_review')
  await knex.schema.dropTableIfExists('condition_report')
  await knex.schema.dropTableIfExists('loan')
  await knex.schema.dropTableIfExists('book_images')
  await knex.schema.dropTableIfExists('book')
  await knex.schema.dropTableIfExists('user')

  // 3. Turn foreign key enforcement back on
  await knex.raw('PRAGMA foreign_keys = ON;')
}
