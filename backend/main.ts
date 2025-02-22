import { Hono } from "hono";

const app = new Hono();

Deno.serve({ port: 8787 }, app.fetch);
