const dotenv = require('dotenv');
const { Pool } = require('pg');

// Load backend .env first (ConfigModule order)
dotenv.config({ path: './apps/backend/.env' });
// Then root
dotenv.config({ path: './.env' });

const databaseUrl = process.env.DATABASE_URL;
const password = process.env.DB_PASSWORD;
console.log('[TEST-PG] databaseUrl:', databaseUrl);
console.log('[TEST-PG] DB_PASSWORD typeof:', typeof password, 'value-preview:', password ? '[REDACTED]' : password);

const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

(async () => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT 1 AS ok');
    console.log('[TEST-PG] query result:', res.rows);
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('[TEST-PG] connection error:');
    console.error(err);
    process.exit(1);
  }
})();
