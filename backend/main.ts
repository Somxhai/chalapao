import { Hono } from "hono";
import "./database/db.ts";
import { auth } from "./lib/auth.ts";
import { HTTPException } from "hono/http-exception";
import { itemApp } from "./handler/item.ts";
import { categoryApp } from "./handler/category.ts";
import { keywordApp } from "./handler/keyword.ts";
import { rentalApp } from "./handler/rental.ts";
import { userInfoApp } from "./handler/user_info.ts";

const app = new Hono();

app.onError((err, c) => {
  console.error(err);

  if (err instanceof HTTPException) {
    const res = err.getResponse();
    return res;
  }
  return c.text(`Internal Server Error: ${err.message}`, 500);
});

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.route("/item", itemApp);
app.route("/category", categoryApp);
app.route("/keyword", keywordApp);
app.route("/rental", rentalApp);
app.route("/user/info", userInfoApp);

// auth.api.signUpEmail({
//   body: {
//     name: "test-chalapao-" + crypto.randomUUID(),
//     email: "test-chalapao-" + crypto.randomUUID() + "@testmail.test",
//     password: "testpassword",
//   },
// });

Deno.serve({ port: 8787 }, app.fetch);
