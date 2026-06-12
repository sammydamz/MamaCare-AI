require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query("UPDATE patients SET name = 'Nana Yaa' WHERE name = 'New User Sammy'")
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch(console.error);
