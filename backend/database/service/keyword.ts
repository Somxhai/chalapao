import { safeQuery } from "../../lib/utils.ts";
import { UUIDTypes } from "uuid";
import { Keyword } from "../../type/app.ts";

export const createKeywordByItemId = async (
  itemId: UUIDTypes,
  keyword: string,
): Promise<Keyword> =>
  await safeQuery(
    (client) =>
      client.query(
        `INSERT INTO "keyword" (item_id, keyword)
         VALUES ($1, $2);`,
        [itemId, keyword],
      ),
    `Failed to add keyword for item: ${itemId}`,
  ).then((res) => res.rows[0]);

export const deleteKeywordByKeyword = async (
  itemId: UUIDTypes,
  keyword: string,
): Promise<UUIDTypes> =>
  await safeQuery(
    (client) =>
      client.query(
        `DELETE FROM "keyword"
         WHERE item_id = $1 AND keyword = $2;`,
        [itemId, keyword],
      ),
    `Failed to delete keyword for item: ${itemId}`,
  ).then((res) => res.rows[0]?.id ?? null);
