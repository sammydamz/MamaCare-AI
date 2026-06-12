import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config();

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
async function run() {
  await client.connect();
  await client.query('ALTER TABLE consultations ADD COLUMN IF NOT EXISTS audio_url TEXT;');
  console.log('Added audio_url');
  await client.end();
}
run();
