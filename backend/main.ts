import { Hono } from "hono";
import "./database/db.ts";
const app = new Hono();

Deno.serve({ port: 8787 }, app.fetch);
