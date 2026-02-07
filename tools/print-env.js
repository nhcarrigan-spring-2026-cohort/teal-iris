const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
dotenv.config({ path: './apps/backend/.env' });
// Load backend then root to match ConfigModule envFilePath priority
dotenv.config({ path: './apps/backend/.env' });
dotenv.config({ path: './.env' });

const raw = process.env.DB_PASSWORD;
console.log('[ENV CHECK] DB_PASSWORD (raw):', raw);
console.log('[ENV CHECK] DB_PASSWORD typeof:', typeof raw);
console.log('[ENV CHECK] DATABASE_URL:', process.env.DATABASE_URL);
console.log('[ENV CHECK] NODE_ENV:', process.env.NODE_ENV);
console.log('[ENV CHECK] Loaded files: .env (root), apps/backend/.env');
