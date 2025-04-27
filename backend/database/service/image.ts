import { safeQuery } from "../../lib/utils.ts";
import { UUIDTypes } from "uuid";

export const addImagesToTable = async (
  targetId: UUIDTypes,
  paths: string[],
  table: "item_image" | "review_item_image" | "review_user_image",
): Promise<string[]> => {
  const target = table !== "item_image" ? "review_id" : "item_id";
  // Just pass the array directly
  return await safeQuery(
    (client) =>
      client.query<{ path: string }>(
        `INSERT INTO ${table} (${target}, path)
         SELECT $1, unnest($2::text[])
         RETURNING path;`,
        [targetId, paths], // Pass the JavaScript array directly
      ),
    `Failed to add images to review: ${targetId}`,
  ).then((res) => {
    console.log(res.rows);
    return res.rows.map((row) => row.path);
  });
};

export const getImagesFromTable = async (
  targetId: UUIDTypes,
  table: "item_image" | "review_item_image" | "review_user_image",
): Promise<string[]> => {
  const target = table != "item_image" ? "review_id" : "item_id";
  return await safeQuery(
    (client) =>
      client.query<{ path: string }>(
        `SELECT path FROM ${table} WHERE ${target} = $1`,
        [targetId],
      ),
    `Failed to get images from: ${targetId}`,
  ).then((res) => res.rows.map((row) => row.path));
};
