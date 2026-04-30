import { Pool } from "pg";

declare global {
  var __bookTrackerPool__: Pool | undefined;
}

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL no esta definida en el entorno.");
  }

  if (!global.__bookTrackerPool__) {
    global.__bookTrackerPool__ = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });
  }

  return global.__bookTrackerPool__;
}
