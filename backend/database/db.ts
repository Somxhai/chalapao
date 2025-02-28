import { Pool } from "deno-postgres";
import {
  CREATE_CATEGORY_TABLE,
  CREATE_ITEM_TABLE,
  CREATE_PAYMENT_TABLE,
  CREATE_RENTAL_TABLE,
  CREATE_REVIEW_TABLE,
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
  // 1. User tables first
  await client.queryArray(CREATE_USER_TABLE);
  await client.queryArray(CREATE_VERIFICATION_TABLE);
  await client.queryArray(CREATE_SESSION_TABLE);
  await client.queryArray(CREATE_ACCOUNT_TABLE);

  // 2. User info and address
  await client.queryArray(CREATE_USER_INFO_TABLE);
  await client.queryArray(CREATE_ADDRESS_TABLE);

  // 3. Category (Independent)
  await client.queryArray(CREATE_CATEGORY_TABLE);

  // 4. Items (Depends on category and user)
  await client.queryArray(CREATE_ITEM_TABLE);

  // 5. Rental (Depends on user)
  await client.queryArray(CREATE_RENTAL_TABLE);

  // 6. Payment (Depends on rental & user)
  await client.queryArray(CREATE_PAYMENT_TABLE);

  // 7. Review (Depends on item & user)
  await client.queryArray(CREATE_REVIEW_TABLE);
}
