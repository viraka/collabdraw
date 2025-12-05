import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// ✅ Create proper Postgres connection pool for Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // ✅ REQUIRED for Neon
  },
});

// ✅ Drizzle instance with schema attached
export const db = drizzle(pool, { schema });
