import { Pool } from "deno-postgres";
import {
  CREATE_CATEGORY_TABLE,
  CREATE_ITEM_IMAGE_TABLE,
  CREATE_ITEM_TABLE,
  CREATE_KEYWORD_TABLE,
  CREATE_PAYMENT_TABLE,
  CREATE_RENTAL_TABLE,
  CREATE_REVIEW_IMAGE_TABLE,
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

try {
  await client.queryArray(CREATE_UPDATE_AT_TRIGGER);

  await client.queryArray(CREATE_USER_TABLE);
  await client.queryArray(CREATE_VERIFICATION_TABLE);
  await client.queryArray(CREATE_SESSION_TABLE);
  await client.queryArray(CREATE_ACCOUNT_TABLE);

  await client.queryArray(CREATE_USER_INFO_TABLE);
  await client.queryArray(CREATE_ADDRESS_TABLE);

  await client.queryArray(CREATE_CATEGORY_TABLE);
  await client.queryArray(CREATE_ITEM_TABLE);
  await client.queryArray(CREATE_RENTAL_TABLE);
  await client.queryArray(CREATE_PAYMENT_TABLE);
  await client.queryArray(CREATE_REVIEW_USER_TABLE);
  await client.queryArray(CREATE_REVIEW_IMAGE_TABLE);
  await client.queryArray(CREATE_KEYWORD_TABLE);
  await client.queryArray(CREATE_ITEM_IMAGE_TABLE);

  const tables = [
    "user",
    "user_info",
    "address",
    "category",
    "item",
    "rental",
    "payment",
    "review",
  ];

  for (const table of tables) {
    const triggerQuery = createUpdateAtTrigger(table);
    await client.queryArray(triggerQuery);
  }
} catch (error) {
  console.error("Error creating tables:", error);
} finally {
  client.release();
}
