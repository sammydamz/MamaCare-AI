import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = fs.readFileSync(path.join(__dirname, '../server/schema.sql'), 'utf8');

const dbUrl = process.env.DATABASE_URL || 
  'postgresql://postgres:QNYhUlhnvFIcbJqCmExqdtFbcvbjdnfv@acela.proxy.rlwy.net:17503/railway';

const pool = new pg.Pool({
  connectionString: dbUrl,
  ssl: dbUrl.includes('railway.internal') ? { rejectUnauthorized: false } : false,
});

pool.query(sql).then(() => {
  console.log('✅ Migration complete.');
  process.exit(0);
}).catch((err) => {
  console.error('❌ Migration failed:', err.message);
  process.exit(1);
});
