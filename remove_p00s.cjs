require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function removeP00s() {
  try {
    // Due to cascading deletes, deleting the patients should also remove their associated consultations, referrals, and action logs.
    await pool.query("DELETE FROM patients WHERE id LIKE 'p00%'");
    console.log("Successfully removed all p00... patients from the database.");
  } catch (error) {
    console.error('Error removing patients:', error);
  } finally {
    await pool.end();
  }
}

removeP00s();
