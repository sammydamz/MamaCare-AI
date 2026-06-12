require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function updatePhones() {
  try {
    const res = await pool.query('SELECT id, name FROM patients');
    for (const row of res.rows) {
      if (row.name === 'Jenna Cummings') {
        await pool.query('UPDATE patients SET phone = NULL WHERE id = $1', [row.id]);
      } else if (row.name === 'Nana Yaa') {
        // Keep the specific number for Nana Yaa
        await pool.query('UPDATE patients SET phone = $1 WHERE id = $2', ['+233597110983', row.id]);
      } else {
        // Generate a random Ghanaian number, e.g., +233 24 XXX XXXX
        const randomDigits = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
        const phone = `+23324${randomDigits}`;
        await pool.query('UPDATE patients SET phone = $1 WHERE id = $2', [phone, row.id]);
      }
    }
    console.log('Successfully updated phone numbers');
  } catch (error) {
    console.error('Error updating phones:', error);
  } finally {
    await pool.end();
  }
}

updatePhones();
