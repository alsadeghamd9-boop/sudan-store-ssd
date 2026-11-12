import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

// Intentionally do not create a client at module scope. Vercel may evaluate modules during build.
let client: ReturnType<typeof postgres> | undefined;
let database: PostgresJsDatabase<typeof schema> | undefined;
export function getDb(): PostgresJsDatabase<typeof schema> {
  if (database) return database;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured");
  client = postgres(connectionString, { ssl: "require", prepare: false, max: 1, idle_timeout: 20, connect_timeout: 10 });
  database = drizzle(client, { schema });
  return database;
}
