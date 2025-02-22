import { ClientOptions, Pool } from "postgres";

const POOL_CONNECTIONS = 20;

const dbParams: ClientOptions = {
  database: Deno.env.get("DATABASE") || "postgres",
  hostname: Deno.env.get("DB_HOST_NAME") || "localhost",
  password: Deno.env.get("DB_PASSWORD") || "",
  user: Deno.env.get("DB_USER") || "postgres",
};

export const pool = new Pool(
  dbParams,
  POOL_CONNECTIONS,
  true,
);
