import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { config } from '../config/index.js';
import * as schema from './schema.js';

let dbInstance: NodePgDatabase<typeof schema> | null = null;
let poolInstance: pg.Pool | null = null;

if (config.database.url) {
  poolInstance = new pg.Pool({
    connectionString: config.database.url,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000,
  });

  poolInstance.on('error', (err) => {
    console.warn('⚠️ Postgres Pool Warning:', err.message);
  });

  dbInstance = drizzle(poolInstance, { schema });
}

export const db = dbInstance;
export const pool = poolInstance;
export { schema };
