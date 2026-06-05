/**
 * @param {import('knex').Knex} knex
 */
export async function seed(knex) {
  const seedFolder = __dirname;
  const files = fs.readdirSync(seedFolder)
    .filter(f => f.endsWith('.sql'))
    .sort(); 

  console.log('Clearing database tables for PostgreSQL...');

  // 1. Disable triggers to bypass foreign key constraints while clearing
  await knex.raw('SET session_replication_role = "replica";');

  // 2. Wipe tables using TRUNCATE 
  await knex.raw('TRUNCATE TABLE "profiles", "book", "book_images", "loan", "condition_report", "book_review", "user_review", "follows" RESTART IDENTITY CASCADE;');

  // 3. Run sequenced .sql files
  for (const file of files) {
    // Skip the seed file itself if it's in the same directory
    if (file === 'seed.js') continue; 
    
    const rawSql = fs.readFileSync(path.join(seedFolder, file), 'utf8');
    if (rawSql.trim()) {
      console.log(`Running seed file: ${file}`);
      await knex.raw(rawSql);
    }
  }

  await knex.raw("SELECT setval('public.profile_id_seq', 10001, false);");
  await knex.raw("SELECT setval('public.book_id_seq', 10001, false);");
  await knex.raw("SELECT setval('public.loan_id_seq', 10001, false);");

  // 5. Re-enable triggers
  await knex.raw('SET session_replication_role = "origin";');

  console.log('All seeds executed successfully on Supabase!');
}