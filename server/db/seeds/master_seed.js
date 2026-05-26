import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @param {import('knex').Knex} knex
 */
export async function seed(knex) {
  // adjust path to where SQL files are stored
  const seedFolder = __dirname;

  const files = fs.readdirSync(seedFolder)
    .filter(f => f.endsWith('.sql'))
    .sort(); // ensures 1_… comes before 2_…

  console.log('Clearing database tables for SQLite...');

  // Temporarily turn off foreign keys so order doesn't crash the script
  await knex.raw('PRAGMA foreign_keys = OFF;');

  // Wipe each table using DELETE
  await knex.raw('DELETE FROM "user";'); // Double quotes guard the 'user' keyword
  await knex.raw('DELETE FROM book;');
  await knex.raw('DELETE FROM book_images;');
  await knex.raw('DELETE FROM loan;');
  await knex.raw('DELETE FROM condition_report;');
  await knex.raw('DELETE FROM book_review;');
  await knex.raw('DELETE FROM user_review;');
  await knex.raw('DELETE FROM follows;');


  // Run sequenced .sql files
  for (const file of files) {
    const rawSql = fs.readFileSync(path.join(seedFolder, file), 'utf8');
    const sql = rawSql.trim();

    if (sql) {
      console.log(`Running seed file: ${file}`);
      await knex.raw(sql);
    }
  }

  
  // Reset SQLite primary key counters
  await knex.raw('DELETE FROM sqlite_sequence;');

  // Turn foreign key validation back on
  await knex.raw('PRAGMA foreign_keys = ON;');  

  console.log('All seeds executed successfully!');
}