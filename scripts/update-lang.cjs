const { Client } = require('pg');
require('dotenv').config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function run() {
  await client.connect();
  await client.query("UPDATE consultations SET language = 'English'");
  await client.query("UPDATE patients SET language = 'English'");
  console.log('Updated database to English');
  await client.end();
}

run().catch(console.error);
