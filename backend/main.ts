import { Hono } from "hono";
import "./database/db.ts";
import { auth } from "./lib/auth.ts";
import { HTTPException } from "hono/http-exception";
import { itemApp } from "./handler/item.ts";
import { categoryApp } from "./handler/category.ts";
import { keywordApp } from "./handler/keyword.ts";
import { rentalApp } from "./handler/rental.ts";
import { userInfoApp } from "./handler/user_info.ts";
import { reviewApp } from "./handler/review.ts";
import { serveStatic } from "hono/deno";

await Deno.mkdir("image/item", { recursive: true });
await Deno.mkdir("image/review", { recursive: true });

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

app.use(
  "/image/item/*",
  serveStatic({
    root: "./",
  }),
);

app.use(
  "/image/review/*",
  serveStatic({
    root: "./",
  }),
);

app.route("/item", itemApp);
app.route("/category", categoryApp);
app.route("/keyword", keywordApp);
app.route("/rental", rentalApp);
app.route("/user/info", userInfoApp);
app.route("review", reviewApp);

Deno.serve({ port: 8787 }, app.fetch);
