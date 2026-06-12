require('dotenv').config();
const { Client } = require('pg');
const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect().then(() => client.query("SELECT pid, state, query FROM pg_stat_activity WHERE state != 'idle'"))
  .then((res) => { console.log(res.rows); process.exit(0); })
  .catch(e => { console.error(e); process.exit(1); });
