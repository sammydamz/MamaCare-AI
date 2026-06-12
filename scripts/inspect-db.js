import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected. Dropping clinical columns from patients table...");
    await client.query(`
      ALTER TABLE patients 
      DROP COLUMN IF EXISTS blood_pressure,
      DROP COLUMN IF EXISTS kick_count,
      DROP COLUMN IF EXISTS sleep_quality,
      DROP COLUMN IF EXISTS bleeding_status;
    `);
    console.log("Columns dropped successfully!");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
