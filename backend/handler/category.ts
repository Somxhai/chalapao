import { Hono } from "hono";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../database/service/category.ts";
import { authMiddleware, isAdmin } from "../middleware.ts"; // Your admin middleware
import { Category } from "../type/app.ts";
import { tryCatchService } from "../lib/utils.ts";
import { auth } from "../lib/auth.ts";

export const categoryApp = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

/**
 * Path: /category/
 * Description: Get all categories.
 */
categoryApp.get("/", async (c) => {
  const categories = await tryCatchService(() => getCategories());
  return c.json(categories);
});

categoryApp.use(authMiddleware);
categoryApp.use(isAdmin); // Admin check middleware

categoryApp.post("/", async (c) => {
  const category: Category = await c.req.json();

  // Create category logic
  const result = await tryCatchService(() => createCategory(category.name));
  return c.json(result);
});

/**
 * Path: /category/:category_id
 * @param {UUIDTypes} category_id - The id of the category to update.
 * @description: Update a category. Only accessible by admins.
 */
categoryApp.put("/:category_id", async (c) => {
  const id = c.req.param("category_id");
  const category: Category = await c.req.json();

  const result = await tryCatchService(() => updateCategory(id, category.name));
  return c.json(result);
});

/**
 * Path: /category/:category_id
 * @param {UUIDTypes} category_id - The id of the category to delete.
 * @description: Delete a category. Only accessible by admins.
 */
categoryApp.delete("/:category_id", async (c) => {
  const id = c.req.param("category_id");

  const result = await tryCatchService(() => deleteCategory(id));
  return c.json(result);
});
