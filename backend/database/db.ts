import postgres from "postgres";
import {
  CREATE_ACCOUNT_TABLE,
  CREATE_SESSION_TABLE,
  CREATE_USER_TABLE,
  CREATE_VERIFICATION_TABLE,
  CREATE_ADDRESS_TABLE,
  CREATE_PAYMENT_TABLE,
  CREATE_RENTAL_TABLE,
  CREATE_ITEM_TABLE,
  CREATE_CATEGORY_TABLE,
  CREATE_REVIEW_TABLE,
} from "./sql.ts";

const sql = postgres({
  database: Deno.env.get("DATABASE") || "postgres",
  hostname: Deno.env.get("DB_HOST_NAME") || "localhost",
  password: Deno.env.get("DB_PASSWORD") || "",
  username: Deno.env.get("DB_USER") || "postgres",
  port: parseInt(Deno.env.get("DB_PORT") || "5432"),
});

// Create tables
await sql.begin(async (sql) => {
  await sql.unsafe(CREATE_USER_TABLE);
  await sql.unsafe(CREATE_ACCOUNT_TABLE);
  await sql.unsafe(CREATE_SESSION_TABLE);
  await sql.unsafe(CREATE_VERIFICATION_TABLE);
  await sql.unsafe(CREATE_ADDRESS_TABLE);
  await sql.unsafe(CREATE_PAYMENT_TABLE);
  await sql.unsafe(CREATE_RENTAL_TABLE);
  await sql.unsafe(CREATE_ITEM_TABLE);
  await sql.unsafe(CREATE_CATEGORY_TABLE);
  await sql.unsafe(CREATE_REVIEW_TABLE);
});
