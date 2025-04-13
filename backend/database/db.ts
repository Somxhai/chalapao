// db/setup.ts
import pg from "npm:pg";

const { Pool } = pg;

import {
  CREATE_CATEGORY_TABLE,
  CREATE_ITEM_IMAGE_TABLE,
  CREATE_ITEM_TABLE,
  CREATE_KEYWORD_TABLE,
  CREATE_PAYMENT_TABLE,
  CREATE_RENTAL_ADDRESS_TABLE,
  CREATE_RENTAL_TABLE,
  CREATE_REVIEW_IMAGE_TABLE,
  CREATE_REVIEW_ITEM_TABLE,
  CREATE_REVIEW_USER_TABLE,
} from "./sql/app.ts";

import {
  CREATE_ADDRESS_TABLE,
  CREATE_USER_INFO_TABLE,
} from "./sql/user_info.ts";

import {
  CREATE_ACCOUNT_TABLE,
  CREATE_SESSION_TABLE,
  CREATE_USER_TABLE,
  CREATE_VERIFICATION_TABLE,
} from "./sql/user.ts";

import {
  CREATE_UPDATE_AT_TRIGGER,
  createUpdateAtTrigger,
} from "./sql/trigger.ts";

export const pool = new Pool({
  host: Deno.env.get("PGHOST") || "localhost",
  port: parseInt(Deno.env.get("PGPORT") || "5439"),
  user: Deno.env.get("PGUSERNAME") || "postgres",
  password: Deno.env.get("PGPASSWORD") || "",
  database: Deno.env.get("PGDATABASE") || "postgres",
});

const client = await pool.connect();

try {
  await client.query(CREATE_UPDATE_AT_TRIGGER);

  await client.query(CREATE_USER_INFO_TABLE);
  await client.query(CREATE_USER_TABLE);
  await client.query(CREATE_VERIFICATION_TABLE);
  await client.query(CREATE_SESSION_TABLE);
  await client.query(CREATE_ACCOUNT_TABLE);

  await client.query(CREATE_ADDRESS_TABLE);

  await client.query(CREATE_CATEGORY_TABLE);
  await client.query(CREATE_ITEM_TABLE);
  await client.query(CREATE_PAYMENT_TABLE);
  await client.query(CREATE_RENTAL_ADDRESS_TABLE);
  await client.query(CREATE_RENTAL_TABLE);

  await client.query(CREATE_REVIEW_USER_TABLE);
  await client.query(CREATE_REVIEW_ITEM_TABLE);
  await client.query(CREATE_REVIEW_IMAGE_TABLE);
  await client.query(CREATE_KEYWORD_TABLE);
  await client.query(CREATE_ITEM_IMAGE_TABLE);

  const tables = [
    "user",
    "user_info",
    "address",
    "category",
    "item",
    "rental",
    "payment",
    "review",
    "review_image",
  ];

  for (const table of tables) {
    const triggerQuery = createUpdateAtTrigger(table);
    await client.query(triggerQuery);
  }
} catch (error) {
  console.error("Error creating tables:", error);
} finally {
  client.release();
}
