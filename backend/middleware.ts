import { auth } from "./lib/auth.ts";
import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return await next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return await next();
});

export const isAdmin = createMiddleware(async (c, next) => {
  const user = c.get("user"); // Assuming the user is attached to the context

  if (user?.user_type !== "admin") {
    return c.json({ message: "Forbidden" }, 403); // Forbidden if the user is not an admin
  }

  return await next(); // Continue to the next handler if the user is an admin
});

export const isLessor = createMiddleware(async (c, next) => {
  const user = c.get("user"); // Assuming the user is attached to the context

  if (user?.user_type !== "lessor") {
    return c.json({ message: "Forbidden" }, 403); // Forbidden if the user is not a lessor
  }

  return await next(); // Continue to the next handler if the user is a lessor
});

export const isRenter = createMiddleware(async (c, next) => {
  const user = c.get("user"); // Assuming the user is attached to the context

  if (user?.user_type !== "renter") {
    return c.json({ message: "Forbidden" }, 403); // Forbidden if the user is not a renter
  }

  return await next(); // Continue to the next handler if the user is a renter
});
