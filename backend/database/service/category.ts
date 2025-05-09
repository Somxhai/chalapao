import { UUIDTypes } from "uuid";
import { safeQuery } from "../../lib/utils.ts";
import { Category } from "../../type/app.ts";

export const getCategories = async () => {
  const categories = await safeQuery(
    (client) =>
      client.query<{ id: string; name: string }>(
        `SELECT id, name
             FROM "category"
             ORDER BY name;`,
      ),
    "Failed to get categories",
  );
  return categories.rows;
};

export const createCategory = async (
  categoryName: string,
): Promise<Category> =>
  await safeQuery(
    (client) =>
      client.query<Category>(
        `INSERT INTO "category" (name)
         VALUES ($1) RETURNING *;`,
        [categoryName],
      ),
    `Failed to create category: ${categoryName}`,
  ).then((res) => res.rows[0]);

export const updateCategory = async (
  categoryId: UUIDTypes,
  categoryName: string,
): Promise<Category> =>
  await safeQuery(
    (client) =>
      client.query<Category>(
        `UPDATE "category"
         SET name = $1
         WHERE id = $2 RETURNING *;`,
        [categoryName, categoryId],
      ),
    `Failed to update category: ${categoryId}`,
  ).then((res) => res.rows[0]);

export const deleteCategory = async (
  categoryId: UUIDTypes,
): Promise<UUIDTypes> =>
  await safeQuery(
    (client) =>
      client.query(
        `DELETE FROM "category"
         WHERE id = $1;`,
        [categoryId],
      ),
    `Failed to delete category: ${categoryId}`,
  ).then((res) => res.rows[0]?.id ?? null);
