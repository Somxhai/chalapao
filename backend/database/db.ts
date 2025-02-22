import { Pool } from "deno-postgres";
import * as SQL from "./sql.ts";

const pool = new Pool(
  {
    database: Deno.env.get("PGDATABASE") || "postgres",
    hostname: Deno.env.get("PGHOST") || "localhost",
    password: Deno.env.get("PGPASSWORD") || "",
    user: Deno.env.get("PGUSERNAME") || "postgres",
    port: parseInt(Deno.env.get("PGPORT") || "5432"),
  },
  20,
  true,
);

export const client = await pool.connect();

{
  await client.queryArray(SQL.CREATE_USER_TABLE);
  await client.queryArray(SQL.CREATE_ACCOUNT_TABLE);
  await client.queryArray(SQL.CREATE_SESSION_TABLE);
  await client.queryArray(SQL.CREATE_VERIFICATION_TABLE);
  await client.queryArray(SQL.CREATE_ADDRESS_TABLE);
  await client.queryArray(SQL.CREATE_ITEM_TABLE);
  await client.queryArray(SQL.CREATE_RENTAL_TABLE);
  await client.queryArray(SQL.CREATE_PAYMENT_TABLE);
  await client.queryArray(SQL.CREATE_REVIEW_TABLE);
  await client.queryArray(SQL.CREATE_CATEGORY_TABLE);
}
