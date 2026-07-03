const { Client } = require('pg');
require('dotenv').config();
const client = new Client({ connectionString: process.env.DATABASE_URL });
async function run() {
  await client.connect();
  await client.query("UPDATE consultations SET risk_level = UPPER(risk_level)");
  await client.query("UPDATE patients SET risk_level = UPPER(risk_level)");
  console.log('Updated db risk levels to uppercase');
  await client.end();
}
run().catch(console.error);
