import { pool } from "../database/db.ts";
import { auth } from "../lib/auth.ts";

export const createUser = async () => {
  const email = "test-chalapao-backend@testmail.test";
  const password = "testpassword";
  // console.log("Creating user with email", email);
  // Try signing in first
  let signin = await auth.api.signInEmail({
    body: { email, password },
    asResponse: true,
  });
  if (!signin.ok) {
    await auth.api.signUpEmail({
      body: {
        name: "test-chalapao-" + crypto.randomUUID(),
        email,
        password,
      },
    });
    signin = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });
  }

  const { token, user }: {
    token: string | null;
    user: typeof auth.$Infer.Session.user | null;
  } = await signin.json();
  const cookie = signin.headers.get("set-cookie");

  return { token, user, cookie };
};

export const createAdmin = async () => {
  const email = "admin-chalapao-backend@testmail.test";
  const password = "adminpassword";
  // console.log("Creating admin with email", email);
  // Try signing in first
  let signin = await auth.api.signInEmail({
    body: { email, password },
    asResponse: true,
  });

  if (!signin.ok) {
    await auth.api.signUpEmail({
      body: {
        name: "admin-chalapao-" + crypto.randomUUID(),
        email,
        password,
      },
    });
    // Set user type to admin
    const client = await pool.connect();
    await client.query(
      "UPDATE \"user\" SET user_type = 'admin' WHERE email = $1",
      [
        email,
      ],
    );

    signin = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });
  }

  const { token, user }: {
    token: string | null;
    user: typeof auth.$Infer.Session.user | null;
  } = await signin.json();
  const cookie = signin.headers.get("set-cookie");

  if (!cookie) {
    throw new Error("Cookie is null");
  }

  return { token, user, cookie };
};
