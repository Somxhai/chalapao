import { UUIDTypes } from "uuid";
import { pool } from "../database/db.ts";
import { auth } from "../lib/auth.ts";
import { APIError } from "better-auth/api";
import { Item } from "../type/app.ts";
import { itemApp } from "../handler/item.ts";
import { assertEquals } from "@std/assert";
import { createUserInfo } from "../database/service/user_info.ts";

type UserType = "renter" | "lessor" | "admin";

export const createUser = async (user_type: UserType = "renter"): Promise<{
  token: string | null;
  user: typeof auth.$Infer.Session.user | null;
  cookie: string | null;
}> => {
  const dev = Deno.env.get("DEV") === "true";

  if (!dev) {
    return { token: null, user: null, cookie: null };
  }

  const email = `${user_type}-chalapao-backend@testmail.test`;
  const password = "testpassword";

  await tryToSignUpUser(email, password);

  if (user_type !== "renter") {
    await setRole(email, user_type);
  }

  const signin = await auth.api.signInEmail({
    body: { email, password },
    asResponse: true,
  });

  const { token, user }: {
    token: string;
    user: typeof auth.$Infer.Session.user;
  } = await signin.json();
  const cookie = signin.headers.get("set-cookie");

  const client = await pool.connect();
  const userInfo = await client.query<{ exists: boolean }>(
    `SELECT  1 FROM "user_info" WHERE user_id = $1`,
    [user.id],
  );
  client.release();

  if (!userInfo.rows[0]) {
    await createUserInfo({
      user_id: user.id,
      first_name: user.name,
      birth_date: new Date(),
      citizen_id: Array.from(
        { length: 10 },
        () => Math.floor(Math.random() * 10),
      )
        .join(""),
      last_name: "User",
      gender: "M",
      phone_number: Array.from(
        { length: 10 },
        () => Math.floor(Math.random() * 10),
      )
        .join(""),
    });
  }

  return { token, user, cookie };
};

const setRole = async (email: string, user_type: UserType) => {
  const client = await pool.connect();
  try {
    const res = await client.query(
      'UPDATE "user" SET user_type = $1 WHERE email = $2',
      [user_type, email],
    );
    if (res.rowCount === 0) {
      throw new Error(
        `Failed to update user_type to ${user_type} for ${email}`,
      );
    }
  } finally {
    client.release();
  }
};

const tryToSignUpUser = async (email: string, password: string) => {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: "test-chalapao-" + crypto.randomUUID(),
        email,
        password,
      },
    });
    console.log("Sign up result: ", result.user.email);
  } catch (error) {
    if (error instanceof APIError) {
      const msg = error.message;
      if (!msg.includes("User already exists")) {
        console.log("Sign up failed: " + error.message, error.status);
        throw error;
      }
    }
  }
};

export const createTestItem = async (user_id: UUIDTypes, cookie: string) => {
  const fakeImage = new File(
    [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], // tiny fake PNG header
    "test.png",
    { type: "image/png" },
  );
  const newItem: Item = {
    owner_id: user_id, // use the actual logged-in user's id
    price_per_day: 100,
    description: "A test item",
    item_name: "Test item",
    penalty_terms: "A test penalty term",
    rental_terms: "A test rental term",
    item_status: "available",
  };

  const formData = new FormData();
  formData.append("item", JSON.stringify(newItem));
  formData.append("files", fakeImage);

  const res = await itemApp.request("/", {
    method: "POST",
    body: formData,
    headers: {
      cookie,
    },
  });

  assertEquals(res.status, 200);
  const createdItem: Item & { paths: string[] } = await res.json();
  assertEquals(createdItem.item_name, newItem.item_name);
  assertEquals(createdItem.owner_id, user_id);
  return createdItem;
};
