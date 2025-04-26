import { pool } from "../database/db.ts";
import { auth } from "../lib/auth.ts";
import { APIError } from "better-auth/api";

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
    token: string | null;
    user: typeof auth.$Infer.Session.user | null;
  } = await signin.json();
  const cookie = signin.headers.get("set-cookie");

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
    await auth.api.signUpEmail({
      body: {
        name: "test-chalapao-" + crypto.randomUUID(),
        email,
        password,
      },
    });
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
